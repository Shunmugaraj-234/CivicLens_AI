import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../context/AuthContext';
import { analyzeCivicImage, generateProfessionalComplaint } from '../../services/aiService';
import { findDuplicateReports, DuplicateMatch } from '../../services/duplicateDetection';
import { calculatePriorityScore, getPriorityLabel } from '../../services/priorityEngine';
import { addReport, getStoredReports, toggleSupportReport } from '../../services/dbService';
import { reverseGeocode, searchLocationQuery } from '../../services/geocodingService';
import { AIAnalysisResult, CivicReport } from '../../types';
import {
  Camera,
  Upload,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Search,
  ThumbsUp,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface ReportWizardProps {
  onSuccess: (report: CivicReport) => void;
  onCancel: () => void;
}

export const ReportWizard: React.FC<ReportWizardProps> = ({ onSuccess, onCancel }) => {
  const { user, updateUserPoints } = useAuth();
  if (!user) return null;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  );

  // Real Location & Nominatim State
  const [location, setLocation] = useState({
    lat: 12.9716,
    lng: 77.5946,
    address: '14th Cross Rd, near Green Valley School, Central District, Metropolis',
    area: 'Central District',
    city: 'Metropolis',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Map Leaflet Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  // Complaint state
  const [complaintTitle, setComplaintTitle] = useState<string>('');
  const [complaintText, setComplaintText] = useState<string>('');
  const [userRemarks, setUserRemarks] = useState<string>('');

  // Duplicate state
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [priorityScore, setPriorityScore] = useState<number>(82);
  const [submittedReport, setSubmittedReport] = useState<CivicReport | null>(null);

  // Leaflet Map Initialization for Step 2
  useEffect(() => {
    if (currentStep !== 2) return;
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center: [location.lat, location.lng],
      zoom: 15,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    // Draggable Location Marker Pin
    const pin = L.marker([location.lat, location.lng], { draggable: true }).addTo(map);
    markerRef.current = pin;

    // Handle Dragging Marker
    pin.on('dragend', async () => {
      const pos = pin.getLatLng();
      await updateGeocodeLocation(pos.lat, pos.lng);
    });

    // Handle Click on Map to Move Marker
    map.on('click', async (e: L.LeafletMouseEvent) => {
      pin.setLatLng(e.latlng);
      await updateGeocodeLocation(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
  }, [currentStep]);

  // Helper to reverse geocode lat/lng
  const updateGeocodeLocation = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    const result = await reverseGeocode(lat, lng);
    setLocation(result);
    setIsGeocoding(false);
  };

  // Step 1: Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 2: Auto GPS location
  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([lat, lng], 16);
            markerRef.current.setLatLng([lat, lng]);
          }
          await updateGeocodeLocation(lat, lng);
        },
        () => {
          // Graceful fallback
        }
      );
    }
  };

  // Search Address Query
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingLocation(true);
    const results = await searchLocationQuery(searchQuery);
    setSearchResults(results);
    setIsSearchingLocation(false);
  };

  const handleSelectSearchResult = async (res: any) => {
    setSearchResults([]);
    setSearchQuery(res.address);
    setLocation(res);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([res.lat, res.lng], 16);
      markerRef.current.setLatLng([res.lat, res.lng]);
    }
  };

  // Step 3: Run AI Analysis
  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCivicImage(imagePreview, imageFile?.name);
      setAiResult(result);

      // Generate Complaint Title & Body
      const { title, formalDescription } = generateProfessionalComplaint(
        result.category,
        location.address,
        result.description,
        userRemarks
      );
      setComplaintTitle(title);
      setComplaintText(formalDescription);

      // Duplicate Check
      const existingReports = getStoredReports();
      const dupMatches = findDuplicateReports(
        location.lat,
        location.lng,
        result.category,
        result.description,
        existingReports
      );
      setDuplicates(dupMatches);

      // Calculate initial priority score
      const calcScore = calculatePriorityScore({
        severity: result.severity,
        riskScore: result.riskScore,
        supportersCount: 1,
        verificationsCount: 0,
        createdAt: new Date().toISOString(),
        category: result.category,
      });
      setPriorityScore(calcScore);

    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setCurrentStep(3);
    }
  };

  // Step 5: Handle supporting duplicate
  const handleSupportDuplicate = (report: CivicReport) => {
    toggleSupportReport(report.id, user.id);
    updateUserPoints(10);
    confetti({ particleCount: 80, spread: 60 });
    onSuccess(report);
  };

  // Final Submit Report
  const handleSubmitReport = () => {
    if (!aiResult) return;

    const newReport = addReport({
      title: complaintTitle,
      description: complaintText,
      category: aiResult.category,
      subcategory: aiResult.subcategory,
      severity: aiResult.severity,
      aiSeverity: aiResult.severity,
      priorityScore,
      confidence: aiResult.confidence,
      riskScore: aiResult.riskScore,
      visibleHazards: aiResult.visibleHazards,
      recommendedAction: aiResult.recommendedAction,
      estimatedUrgency: aiResult.estimatedUrgency,
      location,
      imageUrl: imagePreview,
      status: 'REPORTED',
      reportedBy: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
    });

    setSubmittedReport(newReport);
    updateUserPoints(20);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setCurrentStep(6);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl dark:shadow-2xl overflow-hidden my-6 transition-colors duration-200">
      {/* Wizard Header Progress */}
      <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-500" /> Report a Civic Issue
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">AI-Powered Municipal Intelligence Generator</p>
        </div>

        {/* Stepper indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          {[1, 2, 3, 4, 5, 6].map(stepNum => (
            <div
              key={stepNum}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                currentStep === stepNum
                  ? 'bg-sky-500 text-white font-black shadow-lg shadow-sky-500/40'
                  : currentStep > stepNum
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {currentStep > stepNum ? '✓' : stepNum}
            </div>
          ))}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="p-6 sm:p-8">
        {/* STEP 1: CAPTURE PHOTO */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Step 1: Capture the Problem</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload a clear photo or short video of the civic hazard for AI analysis.</p>
            </div>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-950/60 transition-colors">
              <img
                src={imagePreview}
                alt="Issue Preview"
                className="w-full max-h-72 object-cover rounded-xl mb-4 border border-slate-200 dark:border-slate-700 shadow-md"
              />

              <div className="flex flex-wrap items-center justify-center gap-3">
                <label className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs cursor-pointer shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Photo / Video
                  <input type="file" accept="image/*,video/*" onChange={handleImageChange} className="hidden" />
                </label>

                <label className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer transition-all flex items-center gap-2 border border-slate-300 dark:border-slate-700">
                  <Camera className="w-4 h-4 text-sky-500 dark:text-sky-400" /> Open Camera
                  <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
              <button onClick={onCancel} className="px-5 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Cancel
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
              >
                <span>Next: Location Picker</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: REAL INTERACTIVE MAP LOCATION PICKER */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Step 2: Select Location on Interactive Map</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click on the map or drag the marker to pinpoint the exact issue location.</p>
            </div>

            {/* Address Search & GPS Buttons */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 w-full">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search street, area, landmark..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl flex items-center gap-1 shrink-0"
                  >
                    {isSearchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleDetectGPS}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 shrink-0"
                >
                  <Compass className="w-4 h-4 text-sky-500" /> Use GPS Location
                </button>
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="p-2 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 space-y-1 shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map((r, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectSearchResult(r)}
                      className="p-2 hover:bg-sky-50 dark:hover:bg-slate-900 rounded-xl cursor-pointer text-xs flex items-center justify-between text-slate-800 dark:text-slate-200"
                    >
                      <span className="truncate">{r.address}</span>
                      <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold shrink-0">Select</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Leaflet Real Interactive Map */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-md">
              <div ref={mapContainerRef} className="w-full h-80 z-0" />

              {isGeocoding && (
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-sky-500 text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-2 shadow">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching Address...
                </div>
              )}
            </div>

            {/* Reverse Geocoded Address Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Detected Address</label>
                <input
                  type="text"
                  value={location.address}
                  onChange={e => setLocation({ ...location, address: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">Latitude</span>
                  <input
                    type="number"
                    value={location.lat}
                    onChange={e => setLocation({ ...location, lat: parseFloat(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">Longitude</span>
                  <input
                    type="number"
                    value={location.lng}
                    onChange={e => setLocation({ ...location, lng: parseFloat(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setCurrentStep(1)} className="px-5 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={runAIAnalysis}
                disabled={isAnalyzing}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-sky-500/25"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Image with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Start AI Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AI ANALYSIS RESULTS */}
        {currentStep === 3 && aiResult && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-sky-500" /> AI Diagnostic Results
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Multimodal Gemini Vision Model structured assessment</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column Diagnostics */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Detected Category</span>
                    <span className="text-lg font-black text-sky-600 dark:text-sky-400 uppercase">{aiResult.category.replace('_', ' ')}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-400/30">
                    {(aiResult.confidence * 100).toFixed(0)}% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Severity Level</span>
                    <span className={`text-base font-black ${
                      aiResult.severity === 'CRITICAL' ? 'text-red-600 dark:text-red-500' : aiResult.severity === 'HIGH' ? 'text-orange-600 dark:text-orange-500' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {aiResult.severity}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">AI Risk Score</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">{aiResult.riskScore} / 100</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">AI Explanation</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    {aiResult.description}
                  </p>
                </div>
              </div>

              {/* Right Hazards & Recommendation */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Visible Hazards Identified</span>
                  <div className="space-y-1.5">
                    {aiResult.visibleHazards.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 p-2 rounded-lg border border-amber-200 dark:border-amber-500/20">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Recommended Municipal Action</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    {aiResult.recommendedAction}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setCurrentStep(2)} className="px-5 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
              >
                <span>Next: Complaint Draft</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: COMPLAINT EDITING */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Step 4: AI Generated Complaint</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Review and edit the formal complaint generated for municipal record.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Complaint Title</label>
                <input
                  type="text"
                  value={complaintTitle}
                  onChange={e => setComplaintTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Formal Description</label>
                <textarea
                  rows={6}
                  value={complaintText}
                  onChange={e => setComplaintText(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setCurrentStep(3)} className="px-5 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
              >
                <span>Check for Duplicate Reports</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: DUPLICATE DETECTION CHECK */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <Layers className="w-6 h-6 text-amber-500" /> Duplicate Report Detection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Scanning 250m radius and visual category similarity</p>
            </div>

            {duplicates.length > 0 ? (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 space-y-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>Similar Issue Detected Nearby ({duplicates[0].similarityPercentage}% Match)</span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4">
                  <img
                    src={duplicates[0].report.imageUrl}
                    alt="Existing issue"
                    className="w-full md:w-36 h-28 object-cover rounded-xl"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="text-xs text-sky-600 dark:text-sky-400 font-bold">Report #{duplicates[0].report.id}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{duplicates[0].report.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">📍 {duplicates[0].report.location.address}</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                      👍 {duplicates[0].report.supportersCount} Supporters • Status: {duplicates[0].report.status}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => handleSupportDuplicate(duplicates[0].report)}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" /> Support Existing Issue (+10 Civic Points)
                  </button>

                  <button
                    onClick={handleSubmitReport}
                    className="py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700"
                  >
                    Submit as New Separate Issue
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Duplicate Issues Detected Nearby</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Your report is unique! Submitting will add a new report pin to the live municipal grid with Priority Score {priorityScore}/100.
                </p>
                <div className="pt-3">
                  <button
                    onClick={handleSubmitReport}
                    className="px-9 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm shadow-xl shadow-sky-500/30"
                  >
                    Submit Report Now
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: CONFIRMATION SUCCESS */}
        {currentStep === 6 && submittedReport && (
          <div className="text-center space-y-6 py-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">Report Successfully Logged!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Report ID: <strong className="text-sky-600 dark:text-sky-400">#{submittedReport.id}</strong></p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Civic Priority Score</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400">{submittedReport.priorityScore} / 100</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{submittedReport.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Points Awarded</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">+20 Civic Impact Points</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-4">
              <button
                onClick={() => onSuccess(submittedReport)}
                className="px-8 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/20"
              >
                View Live Report Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

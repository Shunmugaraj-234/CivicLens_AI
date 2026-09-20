import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CivicReport } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { getPriorityLabel } from '../../services/priorityEngine';
import { MapPin, Filter, Layers, Flame, Search, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

// Fix Leaflet marker icons in React Vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface CivicMapProps {
  reports: CivicReport[];
  onSelectReport?: (report: CivicReport) => void;
  onSupportReport?: (reportId: string) => void;
  selectedCategory?: string;
  className?: string;
}

export const CivicMap: React.FC<CivicMapProps> = ({
  reports,
  onSelectReport,
  onSupportReport,
  selectedCategory = 'ALL',
  className = 'h-[600px]',
}) => {
  const { isDark } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>(selectedCategory);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [mapMode, setMapMode] = useState<'markers' | 'heatmap'>('markers');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered reports
  const filteredReports = reports.filter(r => {
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
    if (severityFilter !== 'ALL' && r.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchAddr = r.location.address.toLowerCase().includes(q);
      const matchCat = r.category.toLowerCase().includes(q);
      if (!matchTitle && !matchAddr && !matchCat) return false;
    }
    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    const centerLat = reports[0]?.location.lat || 12.9716;
    const centerLng = reports[0]?.location.lng || 77.5946;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 13,
      zoomControl: true,
    });

    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Change tile layer when isDark changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const newUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    tileLayerRef.current.setUrl(newUrl);
  }, [isDark]);

  // Update Markers when reports or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (mapMode === 'markers') {
      filteredReports.forEach(report => {
        let markerColor = '#10b981'; // green
        if (report.severity === 'MEDIUM') markerColor = '#f59e0b';
        if (report.severity === 'HIGH') markerColor = '#f97316';
        if (report.severity === 'CRITICAL') markerColor = '#ef4444';

        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="
              background-color: ${markerColor};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 4px 10px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 11px;
            ">
              ${report.priorityScore}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([report.location.lat, report.location.lng], { icon: customIcon });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 text-slate-900 dark:text-white rounded-xl max-w-xs text-xs';
        popupContent.innerHTML = `
          <div class="font-bold text-sm mb-1 line-clamp-1">${report.title}</div>
          <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-2">📍 ${report.location.address}</div>
          <img src="${report.imageUrl}" class="w-full h-28 object-cover rounded-lg mb-2" />
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
              report.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30' : 'bg-sky-500/20 text-sky-700 dark:text-sky-300'
            }">${report.category.toUpperCase()}</span>
            <span class="font-bold text-amber-600 dark:text-amber-400">Score: ${report.priorityScore}/100</span>
          </div>
          <div class="flex gap-1 mt-2">
            <button id="popup-view-${report.id}" class="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-1.5 rounded text-[11px] text-center">
              View Details
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btnView = document.getElementById(`popup-view-${report.id}`);
          if (btnView && onSelectReport) {
            btnView.onclick = () => onSelectReport(report);
          }
        });

        markersGroup.addLayer(marker);
      });
    }
  }, [filteredReports, mapMode]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl flex flex-col transition-colors duration-200">
      {/* Top Filter Bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter map area..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-sky-500 w-44"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Categories</option>
            <option value="pothole">Potholes</option>
            <option value="garbage">Garbage</option>
            <option value="streetlight">Streetlight</option>
            <option value="water_leakage">Water Leakage</option>
            <option value="drainage">Drainage</option>
            <option value="open_manhole">Open Manhole</option>
            <option value="fallen_tree">Fallen Tree</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Severity</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg border border-slate-300 dark:border-slate-700">
          <button
            onClick={() => setMapMode('markers')}
            className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
              mapMode === 'markers' ? 'bg-sky-500 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Markers ({filteredReports.length})
          </button>
          <button
            onClick={() => setMapMode('heatmap')}
            className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
              mapMode === 'heatmap' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Issue Density Heatmap
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className={`w-full ${className} z-0`} />

      {/* Map Legend Footer */}
      <div className="p-2.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-900 dark:text-white">Severity Pins:</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Critical (80-100)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> High (60-79)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Medium (30-59)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Low (0-29)</span>
        </div>
        <div>
          Showing {filteredReports.length} reports on live city map grid
        </div>
      </div>
    </div>
  );
};

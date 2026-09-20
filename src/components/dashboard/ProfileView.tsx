import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User, Shield, Bell, Moon, Sun, Award, Save, Lock, Check, Phone, MapPin, Building, Camera, Upload } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateUserAvatar, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState(user?.phone || '');
  const [cityModel, setCityModel] = useState(user?.city || '');
  const [area, setArea] = useState(user?.area || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!user) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateUserAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name || user.name,
      phone: phone || user.phone,
      city: cityModel || user.city,
      area: area || user.area,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 transition-colors duration-200">
      {/* Profile Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-6 shadow-md dark:shadow-xl">
        {/* Profile Avatar with Photo Upload Button */}
        <div className="relative group">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-sky-500 shadow-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white shadow-lg transition-transform transform hover:scale-110 flex items-center justify-center border-2 border-white dark:border-slate-900"
            title="Upload Photo"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-400/30 uppercase">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user.email} • {user.area || 'District'}, {user.city || 'Jurisdiction'}</p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-bold">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Photo
            </button>
            <span className="text-amber-600 dark:text-amber-400">Level {user.level} {user.levelTitle}</span>
            <span className="text-purple-600 dark:text-purple-400">{user.points} XP</span>
            <span className="text-emerald-600 dark:text-emerald-400">Impact Score: {user.impactScore}/100</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md dark:shadow-xl">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-sky-500 dark:text-sky-400" /> Personal Account Settings ({user.role.toUpperCase()})
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Phone with Country Code Selector */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Phone Number with Country Code</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  className="w-32 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US/CA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+49">+49 (DE)</option>
                  <option value="+81">+81 (JP)</option>
                  <option value="+971">+971 (UAE)</option>
                </select>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* City Select Model */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">City Jurisdiction Type</label>
              <select
                value={cityModel}
                onChange={e => setCityModel(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
              >
                <option value="">-- Select City Jurisdiction --</option>
                <option value="Urban Municipality">Urban Municipality</option>
                <option value="Rural Panchayat">Rural Panchayat</option>
                <option value="Metropolitan City">Metropolitan City</option>
                <option value="Suburban District">Suburban District</option>
                <option value="Industrial Zone">Industrial Zone</option>
              </select>
            </div>

            {/* Neighborhood / Area */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Neighborhood / Ward / Area</label>
              <input
                type="text"
                placeholder="Enter ward or neighborhood name"
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
            >
              {isSaved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Saved Profile!' : 'Save Account Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preferences & Appearance */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md dark:shadow-xl">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Moon className="w-5 h-5 text-purple-500 dark:text-purple-400" /> Theme & Interface
        </h3>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 text-xs">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">Color Mode</div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px]">Choose between dark or light preference</div>
          </div>

          <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-900 p-1 rounded-xl border border-slate-300 dark:border-slate-800">
            <button
              onClick={() => setTheme('dark')}
              className={`px-3 py-1 rounded-lg font-bold ${theme === 'dark' ? 'bg-sky-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Dark
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-3 py-1 rounded-lg font-bold ${theme === 'light' ? 'bg-sky-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Light
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

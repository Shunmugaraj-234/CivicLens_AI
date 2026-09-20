import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  UserCheck,
  ShieldAlert,
  Settings,
  ArrowRight,
  Sun,
  Moon,
  Lock,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  Camera,
  Cpu,
  Users,
  Building2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithEmail, loginWithGoogle, registerUser, authError, setAuthError } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [resetSent, setResetSent] = useState<boolean>(false);
  const [welcomeName, setWelcomeName] = useState<string | null>(null);

  // Show/Hide Password toggles
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState<boolean>(false);

  // Form states (No default hardcoded values! Placeholders used!)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'citizen' | 'moderator' | 'admin'>('citizen');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNo, setPhoneNo] = useState('');
  const [cityModel, setCityModel] = useState('Metropolitan City');
  const [regArea, setRegArea] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccessMsg(null);
    if (!email) {
      setAuthError('Please enter your email address to sign in.');
      return;
    }
    if (!password) {
      setAuthError('Please enter your password to sign in.');
      return;
    }

    const success = await loginWithEmail(email, password, role);
    if (success) {
      setWelcomeName(email.split('@')[0] || 'User');
    }
  };

  const handleGoogleSignIn = async () => {
    await loginWithGoogle();
    setWelcomeName('Google Citizen');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setRegSuccessMsg(null);

    if (!regName || !regEmail) {
      setAuthError('Please enter your full name and email address.');
      return;
    }

    // Strong Password Validation
    if (regPassword.length < 8) {
      setAuthError('Strong password required: Password must be at least 8 characters long.');
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(regPassword);
    const hasNumber = /[0-9]/.test(regPassword);
    if (!hasLetter || !hasNumber) {
      setAuthError('Strong password required: Password must contain both letters and numbers.');
      return;
    }

    // Confirm Password Match Validation
    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match! Please check your password and confirm password.');
      return;
    }

    const success = await registerUser(regName, regEmail, regPassword, cityModel, regArea || 'Central Zone');
    if (success) {
      setEmail(regEmail); // Pre-fill login email
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegSuccessMsg('Successfully created the account! Please login below to enter CivicLens AI.');
      setActiveTab('login'); // Redirect user to Sign In tab!
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      setResetSent(true);
      setTimeout(() => {
        setResetSent(false);
        setShowForgotModal(false);
        setForgotEmail('');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-500 selection:text-white transition-colors duration-200">
      
      {/* LEFT COLUMN: HERO BANNER & ILLUSTATION SECTION */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 bg-slate-900 text-white overflow-hidden border-r border-slate-800">
        {/* Background Hero Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url('/login-banner.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60" />

        {/* Top Header Logo */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <MapPin className="w-7 h-7 text-white fill-emerald-100" />
            </div>
            <span className="text-3xl font-black tracking-tight text-white">
              CivicLens <span className="text-emerald-400 font-extrabold">AI</span>
            </span>
          </div>

          <div className="space-y-2 pt-4 max-w-lg">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              See the problem. Report it. <br />
              <span className="text-emerald-400">Track the impact.</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-medium pt-1">
              CivicLens AI helps citizens report civic issues, leverages AI for smart categorization, and builds better communities together.
            </p>
          </div>
        </div>

        {/* Middle Feature Highlights 2x2 Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4 my-8 max-w-lg">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
              <Camera className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Report</h4>
            <p className="text-xs text-slate-300 leading-normal">Capture and report civic issues with instant GPS tags.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">AI-Powered</h4>
            <p className="text-xs text-slate-300 leading-normal">Smart analysis & automatic severity categorization.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Real-Time</h4>
            <p className="text-xs text-slate-300 leading-normal">Track issue resolution status live on interactive map.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-400/30">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Stronger Together</h4>
            <p className="text-xs text-slate-300 leading-normal">Build cleaner, safer, and better communities together.</p>
          </div>
        </div>

        {/* Bottom Signature Tag */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold">Empowering Modern Smart Governance</span>
          <span className="italic font-bold text-emerald-400 text-sm">Better Cities Together</span>
        </div>
      </div>


      {/* RIGHT COLUMN: AUTH FORM SECTION */}
      <div className="flex flex-col justify-between p-6 sm:p-10 relative overflow-y-auto">
        {/* Top-right Theme Switcher */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-md transition-colors flex items-center gap-2 text-xs font-bold"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        {/* Main Login Card */}
        <main className="flex-1 flex items-center justify-center py-8">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Mobile Header Title */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 lg:hidden mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">CivicLens AI</h2>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Welcome back!
              </h1>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Sign in to continue to your account
              </p>
            </div>

            {/* Welcome Toast Banner */}
            {welcomeName && (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/40 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-300">
                Welcome back, {welcomeName} 👋 Redirecting to Dashboard...
              </div>
            )}

            {/* SUCCESS TOAST BANNER */}
            {regSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/40 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-start gap-2.5 animate-in fade-in duration-300">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
                <div className="leading-relaxed">
                  {regSuccessMsg}
                </div>
              </div>
            )}

            {/* AUTH ERROR NOTICE */}
            {authError && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/40 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <div className="leading-relaxed">
                  <strong>Authentication Notice:</strong> {authError}
                </div>
              </div>
            )}

            {/* SIGN IN BUTTONS */}
            <div className="space-y-2.5">
              <button
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-3"
              >
                {/* Google Multi-color SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="flex items-center gap-3 my-2 text-slate-400 text-[11px]">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span>OR CONTINUE WITH EMAIL</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Tab Switcher: Login vs Register */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => {
                  setAuthError(null);
                  setActiveTab('login');
                }}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeTab === 'login'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthError(null);
                  setActiveTab('register');
                }}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeTab === 'register'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* FORM: SIGN IN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Access Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500 font-bold"
                  >
                    <option value="citizen">Citizen Account</option>
                    <option value="moderator">Field Moderator / Officer</option>
                    <option value="admin">Municipal Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Enter registered email (e.g. citizen@civiclens.ai)"
                      value={email}
                      onChange={e => {
                        setAuthError(null);
                        setEmail(e.target.value);
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-sky-600 dark:text-sky-400 hover:underline font-semibold text-[11px]"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-10 py-2.5 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-transform transform hover:-translate-y-0.5"
                >
                  <span>Sign In</span> <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* FORM: REGISTER */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Phone with Country Code Selector */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number with Country Code</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={e => setCountryCode(e.target.value)}
                      className="w-32 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-2.5 font-semibold"
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
                      value={phoneNo}
                      onChange={e => setPhoneNo(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5"
                    />
                  </div>
                </div>

                {/* City Selection Model */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">City Jurisdiction Type</label>
                    <select
                      value={cityModel}
                      onChange={e => setCityModel(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2.5 font-semibold"
                    >
                      <option value="Metropolitan City">Metropolitan City</option>
                      <option value="Urban Municipality">Urban Municipality</option>
                      <option value="Rural Panchayat">Rural Panchayat</option>
                      <option value="Suburban District">Suburban District</option>
                      <option value="Industrial Zone">Industrial Zone</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Area / Ward</label>
                    <input
                      type="text"
                      placeholder="Enter ward or district"
                      value={regArea}
                      onChange={e => setRegArea(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Create Password (Min. 8 characters)</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 8 chars with letters & numbers"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 pr-10 py-2.5 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">Must contain at least 8 characters with letters & numbers.</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 pr-10 py-2.5 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2"
                >
                  <span>Create Account</span> <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Terms notice */}
            <div className="text-[11px] text-center text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              By continuing, you agree to our <span className="text-sky-600 dark:text-sky-400 font-semibold cursor-pointer">Terms of Service</span> and <span className="text-sky-600 dark:text-sky-400 font-semibold cursor-pointer">Privacy Policy</span>.
            </div>
          </div>
        </main>

        {/* FORGOT PASSWORD MODAL */}
        {showForgotModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-sky-500" /> Reset Your Password
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Enter your registered email address and we will send a password reset verification link.
              </p>

              {resetSent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-center space-y-2 text-xs text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <div className="font-bold">Password Reset Email Sent!</div>
                  <p>Check your inbox for further instructions.</p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter registered email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/30"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="p-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          &copy; 2026 CivicLens AI Platform • Powered by Multimodal Innovation
        </footer>
      </div>

    </div>
  );
};

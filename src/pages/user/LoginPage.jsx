import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [domain, setDomain] = useState("");
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter both email/username and password.');
      return;
    }
    if (isLocked) return;
    const result = await login(identifier, password, rememberMe);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      // Failed login
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      setError(result.error);
      // Lock account after 3 failed attempts
      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTimeRemaining(300); // 5 minutes lockout
        setError('Too many failed attempts. Account locked for 5 minutes.');
      }
    }
  };
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  const [particles, setParticles] = useState([]);
  const [clickRipples, setClickRipples] = useState([]);

  const { login, loginWithSSO, loading, isAuthenticated, ssoConfig } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Create particle effect
  const createParticles = (x, y, count = 8) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: `${Date.now()}-${Math.random()}-${i}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1,
      decay: 0.02,
      color: `hsl(${200 + Math.random() * 60}, 70%, 60%)`
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Create click ripple effect
  const createRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = {
      id: `${Date.now()}-${Math.random()}`,
      x,
      y,
      scale: 0
    };
    setClickRipples(prev => [...prev, ripple]);
    setTimeout(() => {
      setClickRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
  };

  // Always redirect to welcome page after login
  const from = '/welcome';

  // Particle animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - particle.decay
        }))
        .filter(particle => particle.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // ...existing code...
    }
  }, [isAuthenticated]);
// ...existing code...

  const handleSSOLogin = async () => {
    setError('');
    const result = await loginWithSSO();
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background image overlay */}
      <img
        src="/wallpaper.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0"
        style={{filter: 'blur(2px)'}}
      />
      {/* Overlay for extra contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 opacity-70 z-0"></div>
      {/* ...existing code... */}
      {/* Header with Logo and Product Name */}
      <header className="w-full max-w-md mx-auto text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-gray-800 via-slate-700 to-gray-900 rounded-full shadow-2xl border-4 border-white/10">
          <img src="/artificial-intelligence.gif" alt="AI Logo" className="w-16 h-16 drop-shadow-lg object-contain rounded-full" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-text-glow-3d">PathFinder AI</h1>
        <h2 className="text-lg text-slate-300 font-medium tracking-wide">Sign In to Enterprise Platform</h2>
      </header>

      {/* Login Card */}
      <main className="w-full max-w-md mx-auto bg-slate-800/80 rounded-2xl shadow-2xl p-8 backdrop-blur-lg animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error/Status Messages */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm animate-shake">
              <div className="flex items-center gap-3 text-red-300">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {loginAttempts > 0 && loginAttempts < 3 && (
            <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 text-yellow-300">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm">Security Alert: {loginAttempts}/3 attempts</span>
              </div>
            </div>
          )}

          {isLocked && (
            <div className="p-4 bg-red-600/30 border border-red-500/50 rounded-lg backdrop-blur-sm animate-pulse">
              <div className="flex items-center gap-3 text-red-200">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <div className="text-sm font-medium">Account Temporarily Locked</div>
                  <div className="text-xs">Unlock in: {lockTimeRemaining}s</div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Input Fields with 3D effects */}
          <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
            {/* Username/Email */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Username or Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors animate-float-3d" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onClick={(e) => createRipple(e)}
                  disabled={isLocked}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm hover:bg-slate-700/60 btn-3d relative overflow-hidden text-base font-medium"
                  placeholder="Enter your username or email address"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onClick={(e) => createRipple(e)}
                  disabled={isLocked}
                  className="w-full pl-12 pr-14 py-4 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm hover:bg-slate-700/60 btn-3d relative overflow-hidden text-base font-medium"
                  placeholder="Enter your secure password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-400 transition-colors transform hover:scale-110 focus:outline-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.5 8.5m1.378 1.378l4.242 4.242M12 3c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21l-6-6m-6-6L3 3m6 6l6 6" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Domain selection row */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
                </svg>
                Domain
              </label>
              <select
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm text-base font-medium"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                required
              >
                <option value="" disabled>Select Domain</option>
                <option value="healthcare">Healthcare</option>
                <option value="travel">Travel</option>
                <option value="banking">Banking</option>
              </select>
            </div>
          </div>

          {/* Interactive Sign In Button with 3D effects */}
          <button
            type="submit"
            disabled={loading || isLocked || !identifier || !password}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-2xl btn-3d btn-interactive animate-fade-in-up relative overflow-hidden text-base"
            style={{animationDelay: '1.5s'}}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin w-5 h-5 animate-rotate-3d" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating Access...</span>
              </div>
            ) : (
              <span>Sign In to Enterprise Platform</span>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
export default Login;

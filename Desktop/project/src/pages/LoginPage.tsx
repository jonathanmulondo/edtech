import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '@lib/auth/AuthContext';
import { useToastStore } from '@lib/hooks/useToast';

/**
 * Mock Login Page Component
 * Dark theme design inspired by modern mobile app interfaces
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const addToast = useToastStore((state) => state.addToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      addToast({
        type: 'error',
        message: 'Please enter both email and password',
      });
      return;
    }

    setIsLoading(true);

    // Mock login - simulate API call
    setTimeout(() => {
      // Create user object
      const user = {
        email,
        name: email.split('@')[0],
        role: 'homeowner' as const,
      };

      // Use auth context to login
      login(user);

      addToast({
        type: 'success',
        message: 'Login successful! Welcome to Senergy.',
      });

      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-950/20 via-transparent to-transparent" />

      {/* iPhone-style Container */}
      <div className="relative w-full max-w-sm">
        {/* Glowing ring decoration at top */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-32 h-32 flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-lime-400/30 to-green-500/30 blur-2xl animate-pulse-slow" />
          <div className="relative w-24 h-24 rounded-full border-4 border-lime-400/80 shadow-[0_0_40px_rgba(163,230,53,0.5)]" />
        </div>

        {/* Main Card */}
        <div className="relative mt-52 bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-800/50 overflow-hidden">
          {/* Back button */}
          <button className="absolute top-6 left-6 w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:bg-gray-700/50 transition-colors">
            <ArrowLeft size={20} />
          </button>

          {/* Content */}
          <div className="px-8 pt-20 pb-8">
            {/* Title */}
            <h1 className="text-3xl font-light text-white mb-2 text-center">
              Welcome Back!
            </h1>
            <p className="text-sm text-gray-400 text-center mb-8">
              Sign in to access smart, personalized solar<br />energy management
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
                  Email address*
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20 focus:outline-none transition-all"
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
                  Password*
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="@Sn123hsn#"
                    className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20 focus:outline-none transition-all pr-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-[#0f0f0f] text-lime-400 focus:ring-lime-400/20 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-gray-400 group-hover:text-gray-300">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-gray-400 hover:text-lime-400 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-lime-400 to-green-400 hover:from-lime-500 hover:to-green-500 text-black font-semibold rounded-xl shadow-lg shadow-lime-500/25 hover:shadow-lime-500/40 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Zap size={18} fill="currentColor" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1a1a1a] text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#0f0f0f] border border-gray-800 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:border-gray-700 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#0f0f0f] border border-gray-800 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:border-gray-700 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-sm font-medium">Apple</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-lime-400 hover:text-lime-300 font-semibold transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

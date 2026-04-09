import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email, password, name);
      navigate('/');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-6">
      <div className="w-full max-w-[400px] animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 mb-2">Create an account</h2>
          <p className="text-zinc-500 text-sm">Every application counts. Start tracking today.</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border border-red-100 bg-red-50/50 rounded-lg px-3 py-2 text-[13px] text-red-600 animate-fade-in font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="register-name" className="text-[13px] font-medium text-zinc-700">
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm text-zinc-900 placeholder-zinc-400 bg-zinc-50/30 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all outline-none"
                placeholder="John Doe"
                autoComplete="name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-[13px] font-medium text-zinc-700">
                Email address
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm text-zinc-900 placeholder-zinc-400 bg-zinc-50/30 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all outline-none"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-password" title="Password" className="text-[13px] font-medium text-zinc-700">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm text-zinc-900 placeholder-zinc-400 bg-zinc-50/30 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all outline-none"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="space-y-1.5 pb-2">
              <label htmlFor="register-confirm" className="text-[13px] font-medium text-zinc-700">
                Confirm Password
              </label>
              <input
                id="register-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm text-zinc-900 placeholder-zinc-400 bg-zinc-50/30 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all outline-none"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-zinc-950 text-white font-medium rounded-lg text-sm hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
              id="register-submit"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-zinc-900 font-medium hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

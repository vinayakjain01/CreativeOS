import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth';

/**
 * Minimal email/password gate shown when Supabase is configured but no session
 * exists. Reuses the CatalogStudio auth backend (Supabase Auth) — same users,
 * same RLS. Supports sign-in and sign-up against the same project.
 */
export default function SignIn() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const action = mode === 'signin' ? signIn : signUp;
    const { error } = await action(email.trim(), password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    if (mode === 'signup') {
      setNotice('Account created. Check your email to confirm, then sign in.');
      setMode('signin');
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-secondary))] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md card-lg p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-heading-m text-[rgb(var(--color-text-primary))]">CreativeOS</h1>
            <p className="text-body-sm text-[rgb(var(--color-text-secondary))]">
              {mode === 'signin' ? 'Sign in to your workspace' : 'Create your account'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-error-50 dark:bg-error-950/30 border border-error-200 dark:border-error-800">
            <AlertCircle size={18} className="text-error-600 shrink-0 mt-0.5" />
            <span className="text-body-sm text-[rgb(var(--color-text-primary))]">{error}</span>
          </div>
        )}
        {notice && (
          <div className="mb-4 p-3 rounded-lg bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800">
            <span className="text-body-sm text-[rgb(var(--color-text-primary))]">{notice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label mb-1 block" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@brand.com"
            />
          </div>
          <div>
            <label className="label mb-1 block" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary btn-md w-full justify-center" disabled={loading}>
            {loading && <Loader2 size={18} className="animate-spin" />}
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-body-sm text-[rgb(var(--color-text-secondary))]">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError(null);
              setNotice(null);
            }}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

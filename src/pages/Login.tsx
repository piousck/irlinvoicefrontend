import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { login, getMe } from '../api/auth';
import { authStore } from '../store/authStore';
import { useToast } from '../components/shared/ToastProvider';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type Form = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { show } = useToast();
  const setAuth = authStore((s) => s.setAuth);
  const setUser = authStore((s) => s.setUser);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: Form) => {
    try {
      const res = await login(values.email, values.password);
      setAuth(res.access_token, res.organisation_id);
      const me = await getMe();
      setUser(me);
      navigate('/');
    } catch {
      show({ title: 'Login failed', description: 'Check your credentials and try again.', variant: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-warm-off to-emerald-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
              <rect x="4" y="3" width="16" height="18" rx="2" fill="white" fillOpacity="0.9" />
              <path d="M8 8h8M8 12h8M8 16h5" stroke="#01696f" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">IrishInvoice</h1>
          <p className="mt-1 text-sm text-slate-500">Document intelligence for Irish SMEs</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Sign in to your account</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-700">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-700">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-slate-500">
            No account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

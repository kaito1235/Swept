import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../utils/validators';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { APP_NAME } from '../../config/app';

export function LoginPage() {
  const { login, appUser, hasRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit({ email, password }) {
    setLoading(true);
    try {
      await login(email, password);
      // AuthContext will update appUser — navigate based on role
      // Small delay to let context update
      setTimeout(() => {
        if (!hasRole) {
          navigate('/select-role');
        } else {
          const path = appUser?.role === 'host' ? '/dashboard/host' : '/dashboard/cleaner';
          navigate(path);
        }
      }, 100);
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl text-gray-900">{APP_NAME}</h1>
          <p className="mt-2 text-gray-500">Welcome back</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Your password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3"
            >
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0D9488] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

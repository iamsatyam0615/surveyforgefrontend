'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';

type FormData = { email: string; password: string };

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      router.push('/admin/dashboard');
    } catch (error) {
      // Error handled by useAuth hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg">
      <Input
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
        label="Email"
        type="email"
        placeholder="Enter your email"
        error={errors.email?.message}
      />
      
      <Input
        {...register('password', { 
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          }
        })}
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
      />
      
      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';

type FormData = { email: string; password: string; confirmPassword: string };

export default function SignupForm() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>();
  const { signup } = useAuth();
  const router = useRouter();

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    try {
      await signup({ email: data.email, password: data.password });
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
      
      <Input
        {...register('confirmPassword', { 
          required: 'Please confirm your password',
          validate: value => value === password || 'Passwords do not match'
        })}
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
      />
      
      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  );
}

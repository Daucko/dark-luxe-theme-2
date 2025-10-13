import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'ADMIN' | 'TEACHER'>('STUDENT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to route based on role
  const routeByRole = (userRole: 'ADMIN' | 'TEACHER' | 'STUDENT') => {
    if (userRole === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (userRole === 'TEACHER') {
      navigate('/teacher/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  // Extract a readable error message from various error shapes
  const extractErrorMessage = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const data: any = err.response?.data;
      if (typeof data?.error === 'string') return data.error;
      if (typeof data?.message === 'string') return data.message;
    }
    return (err as any)?.message || 'Authentication failed';
  };

  // Centralized post-auth success handler
  const postAuthSuccess = (data: any) => {
    // The backend sets an HTTP-only cookie, so we don't need to store the token client-side
    const serverRole = data?.user?.role as
      | 'ADMIN'
      | 'TEACHER'
      | 'STUDENT'
      | undefined;
    if (!serverRole) {
      toast({
        title: 'Error',
        description: 'Server did not return a role. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: isSignUp ? 'Account created' : 'Signed in successfully',
    });

    // Clear sensitive fields
    setPassword('');
    setConfirmPassword('');

    routeByRole(serverRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (isSignUp && password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    const nameTrimmed = name.trim();

    setIsSubmitting(true);
    try {
      // TODO: Prefer using dedicated endpoints like /api/auth/login and /api/auth/register
      const endpoint = `/api/auth?action=${isSignUp ? 'register' : 'login'}`;
      const payload = isSignUp
        ? {
            email: emailTrimmed,
            password: passwordTrimmed,
            name: nameTrimmed,
            role,
          }
        : { email: emailTrimmed, password: passwordTrimmed };

      const response = await axios.post(endpoint, payload, {
        withCredentials: true, // Ensure cookies are sent/received
      });
      const data = response.data;

      postAuthSuccess(data);
    } catch (err) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Auth error:', err);
      }
      const errorMessage = extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Guard placeholder behind development environment
    if (!import.meta.env.DEV) {
      toast({
        title: 'Not configured',
        description: 'Google sign-in is not configured for this environment.',
      });
      return;
    }

    if (isSubmitting) return;

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      toast({
        title: 'Simulation requires email',
        description: 'Enter an email to simulate Google login in development.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const googleId = 'demo-google-id';
      const googleName = emailTrimmed.split('@')[0];
      const googleAvatar =
        'https://ui-avatars.com/api/?name=' + encodeURIComponent(googleName);

      // TODO: Replace with real OAuth flow and a dedicated endpoint, e.g., /api/auth/google
      const response = await axios.post('/api/auth?action=google', {
        googleId,
        email: emailTrimmed,
        name: googleName,
        avatar: googleAvatar,
        role,
      }, {
        withCredentials: true, // Ensure cookies are sent/received
      });
      const data = response.data;

      postAuthSuccess(data);
    } catch (err) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Google auth error:', err);
      }
      const errorMessage = extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage || 'Google authentication failed',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your details to create your account'
              : 'Enter your credentials to access your account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Sign in as</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={role === 'STUDENT' ? 'default' : 'outline'}
                aria-pressed={role === 'STUDENT'}
                disabled={isSubmitting}
                onClick={() => setRole('STUDENT')}
                className="w-full"
              >
                Student
              </Button>
              <Button
                type="button"
                variant={role === 'TEACHER' ? 'default' : 'outline'}
                aria-pressed={role === 'TEACHER'}
                disabled={isSubmitting}
                onClick={() => setRole('TEACHER')}
                className="w-full"
              >
                Teacher
              </Button>
              {!isSignUp && (
                <Button
                  type="button"
                  variant={role === 'ADMIN' ? 'default' : 'outline'}
                  aria-pressed={role === 'ADMIN'}
                  disabled={isSubmitting}
                  onClick={() => setRole('ADMIN')}
                  className="w-full"
                >
                  Admin
                </Button>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            <Mail className="mr-2 h-4 w-4" />
            Continue with <span style={{ color: '#4285F4' }}>G</span>
            <span style={{ color: '#EA4335' }}>o</span>
            <span style={{ color: '#FBBC04' }}>o</span>
            <span style={{ color: '#4285F4' }}>g</span>
            <span style={{ color: '#34A853' }}>l</span>
            <span style={{ color: '#EA4335' }}>e</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSignUp ? 'Sign up' : 'Sign in'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

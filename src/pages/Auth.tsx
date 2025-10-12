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

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form submitted');

    e.preventDefault();

    console.log(e);

    if (isSignUp && password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    console.log('Form submitted cp 2');

    try {
      const endpoint = `/api/auth?action=${isSignUp ? 'register' : 'login'}`;
      const payload = isSignUp
        ? { email, password, name, role }
        : { email, password };
      const response = await axios.post(endpoint, payload);
      const data = response.data;
      console.log(data);

      const userRole = data.user?.role || role;
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (userRole === 'TEACHER') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.response?.data?.error || 'Authentication failed',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    // This is a placeholder for Google OAuth integration
    // You would typically use a Google OAuth library here to get user info
    // For demo, we'll simulate a Google login
    try {
      const googleId = 'demo-google-id';
      const googleName = email.split('@')[0];
      const googleAvatar = 'https://ui-avatars.com/api/?name=' + googleName;
      const response = await axios.post('/api/auth?action=google', {
        googleId,
        email,
        name: googleName,
        avatar: googleAvatar,
        role,
      });
      const data = response.data;
      localStorage.setItem('token', data.token);
      const userRole = data.user?.role || role;
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (userRole === 'TEACHER') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.error || 'Google authentication failed',
        variant: 'destructive',
      });
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
                onClick={() => setRole('STUDENT')}
                className="w-full"
              >
                Student
              </Button>
              <Button
                type="button"
                variant={role === 'TEACHER' ? 'default' : 'outline'}
                onClick={() => setRole('TEACHER')}
                className="w-full"
              >
                Teacher
              </Button>
              {!isSignUp && (
                <Button
                  type="button"
                  variant={role === 'ADMIN' ? 'default' : 'outline'}
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

            <Button type="submit" className="w-full">
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

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name,setName]=useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login/signup logic here
    console.log({ email, password, isLogin,name });
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Sign Up'} – Aurabites</title>
      </Helmet>

      <div className="min-h-screen bg-background flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Back to Home */}
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌸</span>
              <span className="font-display font-extrabold text-2xl text-primary">Aurabites</span>
            </div>

            {/* Header */}
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-foreground">
                {isLogin ? 'Welcome back!' : 'Create account'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isLogin 
                  ? 'Login to track your orders and access exclusive deals.'
                  : 'Join Aurabites to get exclusive offers and track orders.'}
              </p>
            </div>

            {/* Optional Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/20 rounded-full text-sm text-accent">
              <span>✨</span>
              <span>Login is optional – you can order as guest</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                {
                  !isLogin && 
                     
                <div>
                  <Label htmlFor="email">Name</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 rounded-xl h-12"
                  />
                </div>
                </div>
                }
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-xl h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 rounded-xl h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button type="submit" className="w-full rounded-xl h-12 text-base font-semibold">
                {isLogin ? 'Login' : 'Create Account'}
              </Button>
            </form>

            {/* Toggle */}
            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>

            {/* Continue as Guest */}
            <div className="text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Continue shopping as guest →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden lg:flex flex-1 gradient-mint items-center justify-center p-12">
          <div className="text-center max-w-md">
            <div className="text-9xl mb-6 animate-bounce-subtle">🫛</div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Crunch into Wellness
            </h2>
            <p className="text-muted-foreground">
              Join thousands of health-conscious snackers who chose Aurabites for guilt-free munching.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

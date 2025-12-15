import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DotPattern from '../components/DotPattern';

// Preset credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isAdminLoggedIn === 'true') {
      navigate(createPageUrl('Admin'));
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        navigate(createPageUrl('Admin'));
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white relative flex items-center justify-center">
      <DotPattern />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#87BAC3]/30 p-8 md:p-10">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#473472] to-[#53629E] rounded-2xl flex items-center justify-center shadow-lg">
              <Shield size={40} className="text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#473472] mb-2">Admin Login</h1>
            <p className="text-gray-600">Enter your credentials to access the admin dashboard</p>
          </div>

          {/* Credentials Info Alert */}
          <Alert className="mb-6 bg-[#87BAC3]/10 border-[#87BAC3]/30">
            <AlertCircle className="text-[#53629E]" size={18} />
            <AlertDescription className="text-sm">
              <strong>Demo Credentials:</strong><br />
              Username: <code className="bg-white px-2 py-0.5 rounded">admin</code><br />
              Password: <code className="bg-white px-2 py-0.5 rounded">admin123</code>
            </AlertDescription>
          </Alert>

          {/* Error Message */}
          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="text-red-600" size={18} />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[#473472] font-medium">Username</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="pl-12 rounded-xl border-[#87BAC3]/30 focus:border-[#473472] h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#473472] font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="pl-12 rounded-xl border-[#87BAC3]/30 focus:border-[#473472] h-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[#473472] to-[#53629E] hover:from-[#53629E] hover:to-[#473472] text-white rounded-xl font-semibold text-lg shadow-lg transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <a
              href={createPageUrl('Home')}
              className="text-[#53629E] hover:text-[#473472] text-sm font-medium transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>

        {/* Info Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Secure admin access for managing lost and found items
        </p>
      </div>
    </div>
  );
}

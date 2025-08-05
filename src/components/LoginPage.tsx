import React, { useState } from 'react';
import { BookOpen, User, Lock, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (matricNumber: string, role: 'admin' | 'student') => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [matricNumber, setMatricNumber] = useState('');
  const [role, setRole] = useState<'admin' | 'student'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (role === 'admin') {
      if (matricNumber === 'admin' || matricNumber === 'ADMIN') {
        onLogin(matricNumber, 'admin');
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      // Validate student matric number format
      const matricPattern = /^CFJ\/(ND|HND)\/COM\/\d{4}\/\d{3}$/i;
      if (matricPattern.test(matricNumber)) {
        onLogin(matricNumber.toUpperCase(), 'student');
      } else {
        setError('Invalid matric number format. Use: CFJ/ND/COM/2024/001');
      }
    }
    setIsLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 relative"
    >
      {/* Single Large Watermark */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center"
        style={{
          backgroundImage: `url('./download.jpeg')`,
          backgroundSize: '800px 800px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>

      <div className="relative z-10 max-w-md w-full mx-4">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="./download.jpeg" 
              alt="FCFJ Logo" 
              className="w-24 h-24 rounded-full shadow-lg border-4 border-white"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to FCFJ
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            Federal College of Forestry Jos
          </p>
          <p className="text-sm text-gray-500">
            Computer Science Department
          </p>
          <p className="text-sm text-green-600 font-medium mt-2">
            QR Code Attendance System
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Sign In
          </h2>

          {/* Role Selection */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                role === 'student'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                role === 'admin'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {role === 'admin' ? 'Admin Username' : 'Matric Number'}
              </label>
              <input
                type="text"
                required
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder={role === 'admin' ? 'Enter admin username' : 'CFJ/ND/COM/2024/001'}
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sample Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Credentials:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Student:</strong> CFJ/ND/COM/2024/001</p>
              <p><strong>Admin:</strong> admin</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Federal College of Forestry Jos</p>
          <p>Computer Science Department</p>
        </div>
      </div>
    </div>
  );
}
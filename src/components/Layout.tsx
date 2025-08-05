import React from 'react';
import { BookOpen, Users, QrCode, BarChart3, Settings, LogOut, HelpCircle, TestTube } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  onShowHowToUse: () => void;
  onShowTesting: () => void;
  currentUser: User;
}

export default function Layout({ 
  children, 
  currentPage, 
  onPageChange, 
  onLogout, 
  onShowHowToUse,
  onShowTesting,
  currentUser 
}: LayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'attendance', label: 'Mark Attendance', icon: QrCode },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div 
      className="min-h-screen bg-gray-50 relative"
    >
      {/* Single Large Watermark */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center"
        style={{
          backgroundImage: `url('./download.jpeg')`,
          backgroundSize: '1000px 1000px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="./download.jpeg" 
                alt="FCFJ Logo" 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">FCFJ Attendance System</h1>
                <p className="text-sm text-gray-500">Computer Science Department</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onShowTesting}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <TestTube className="w-4 h-4" />
                <span className="text-sm">Testing Guide</span>
              </button>
              <button
                onClick={onShowHowToUse}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">How to Use</span>
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {currentUser.role === 'admin' ? 'Administrator' : currentUser.matricNumber}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onPageChange(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        currentPage === item.id
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useAuth } from './auth/useAuth';
import { AppUser, Role } from './types';
import SessionList from './components/SessionList';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';

export default function App() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [role, setRole] = useState<Role>('user');

  // --- Loading splash ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
        Signing in…
      </div>
    );
  }

  // --- Not signed in → show login page ---
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // --- Signed in → build AppUser from Entra account ---
  const currentUser: AppUser = {
    id: user.id,
    name: user.name,
    role,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              AI Event{' '}
              <span className="text-blue-600">ft. 60 Years POI</span>
            </h1>
            <p className="text-sm text-gray-500">Session Registration Portal</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Signed-in user display */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold select-none">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm leading-tight">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Role toggle */}
            <button
              onClick={() =>
                setRole((r) => (r === 'user' ? 'admin' : 'user'))
              }
              className={`text-sm px-3 py-1 rounded font-medium border transition-colors ${
                role === 'admin'
                  ? 'bg-amber-100 border-amber-400 text-amber-800'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {role === 'admin' ? 'Admin Mode ON' : 'Switch to Admin'}
            </button>

            {/* Sign out */}
            <button
              onClick={logout}
              className="text-sm px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {role === 'admin' && <AdminPanel currentUser={currentUser} />}
        <SessionList currentUser={currentUser} />
      </main>

      <footer className="text-center text-xs text-gray-400 py-6">
        POI 60th Anniversary · AI Event Management System
      </footer>
    </div>
  );
}

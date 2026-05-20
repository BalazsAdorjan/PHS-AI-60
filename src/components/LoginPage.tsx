import { useAuth } from '../auth/useAuth';

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 w-full max-w-sm flex flex-col items-center gap-6">
        {/* Branding */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            AI Event
          </h1>
          <p className="text-sm text-blue-600 font-medium mt-0.5">
            ft. 60 Years POI
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Sign in with your organizational account to register for sessions.
          </p>
        </div>

        {/* Microsoft SSO button */}
        <button
          onClick={login}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {/* Microsoft logo SVG */}
          <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
          {isLoading ? 'Signing in…' : 'Sign in with Microsoft'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Your account is managed by your organization.
          <br />
          No new registration required.
        </p>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        POI 60th Anniversary · AI Event Management System
      </p>
    </div>
  );
}

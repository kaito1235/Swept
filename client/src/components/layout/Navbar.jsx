import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../config/app';
import { Button } from '../ui/Button';

export function Navbar() {
  const { isAuthenticated, appUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const dashboardPath = appUser?.role === 'host' ? '/dashboard/host' : '/dashboard/cleaner';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="font-heading text-2xl font-semibold text-[#0D9488] tracking-tight"
          >
            {APP_NAME}
            <span className="text-[#F59E0B]">.</span>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  className="text-sm font-medium text-gray-600 hover:text-[#0D9488] transition-colors"
                >
                  Dashboard
                </Link>

                {appUser?.role === 'host' && (
                  <>
                    <Link
                      to="/search"
                      className="text-sm font-medium text-gray-600 hover:text-[#0D9488] transition-colors"
                    >
                      Find cleaners
                    </Link>
                    <Link
                      to="/bookings"
                      className="text-sm font-medium text-gray-600 hover:text-[#0D9488] transition-colors"
                    >
                      My bookings
                    </Link>
                  </>
                )}

                {appUser?.role === 'cleaner' && (
                  <Link
                    to="/cleaner/bookings"
                    className="text-sm font-medium text-gray-600 hover:text-[#0D9488] transition-colors"
                  >
                    My jobs
                  </Link>
                )}

                <span className="text-sm text-gray-400 hidden sm:inline">|</span>
                <span className="text-sm text-gray-500 hidden sm:inline">{appUser?.name?.split(' ')[0]}</span>
                <Button variant="ghost" onClick={handleLogout} className="text-sm px-3 py-1.5">
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/search"
                  className="text-sm font-medium text-gray-600 hover:text-[#0D9488] transition-colors"
                >
                  Find cleaners
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-[#0D9488] transition-colors"
                >
                  Log in
                </Link>
                <Button
                  variant="primary"
                  onClick={() => navigate('/register')}
                  className="text-sm px-4 py-2"
                >
                  Get started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

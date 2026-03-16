import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { RoleCard } from '../../components/ui/RoleCard';
import { Button } from '../../components/ui/Button';
import { APP_NAME, ROLES } from '../../config/app';

const HostIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.25 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const CleanerIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

export function RoleSelectionPage() {
  const { setRole, appUser } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!selectedRole) return;
    setLoading(true);
    try {
      const updated = await setRole(selectedRole);
      toast.success(`Welcome to ${APP_NAME}!`);
      const path = updated.role === ROLES.HOST ? '/dashboard/host' : '/dashboard/cleaner';
      navigate(path, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Failed to set role');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl text-gray-900">
            How will you use {APP_NAME}?
          </h1>
          <p className="mt-2 text-gray-500">
            {appUser?.name ? `Hi ${appUser.name}! ` : ''}Choose your role to continue.
          </p>
        </div>

        <div className="space-y-4">
          <RoleCard
            title="I'm a property owner / host"
            description="I need cleaners for my home, Airbnb, or rental property."
            icon={<HostIcon />}
            selected={selectedRole === ROLES.HOST}
            onClick={() => setSelectedRole(ROLES.HOST)}
          />
          <RoleCard
            title="I'm a cleaner / cleaning company"
            description="I want to find clients and manage my cleaning bookings."
            icon={<CleanerIcon />}
            selected={selectedRole === ROLES.CLEANER}
            onClick={() => setSelectedRole(ROLES.CLEANER)}
          />
        </div>

        <Button
          variant="primary"
          className="w-full mt-6 py-3"
          disabled={!selectedRole}
          loading={loading}
          onClick={handleConfirm}
        >
          Continue
        </Button>

        <p className="mt-4 text-center text-xs text-gray-400">
          This cannot be changed later.
        </p>
      </div>
    </div>
  );
}

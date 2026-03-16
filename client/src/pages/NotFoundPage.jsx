import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { APP_NAME } from '../config/app';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-heading text-8xl text-[#0D9488] font-semibold">404</p>
        <h1 className="mt-4 font-heading text-2xl text-gray-900">Page not found</h1>
        <p className="mt-2 text-gray-500">
          This page doesn't exist or has been moved.
        </p>
        <Button
          variant="primary"
          className="mt-6 px-6 py-2.5"
          onClick={() => navigate('/')}
        >
          Back to {APP_NAME}
        </Button>
      </div>
    </div>
  );
}

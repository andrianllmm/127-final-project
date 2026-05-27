import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '@/shared/lib/authClient';

export const HomePage = () => {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      navigate('/items', { replace: true });
      return;
    }

    const role = session.user.role;

    switch (role) {
      case 'customer':
      default:
        navigate('/items', { replace: true });
        break;

      case 'vendor':
        navigate('/store-analytics', { replace: true });
        break;

      case 'rider':
        navigate('/offers', { replace: true });
        break;
    }
  }, [session, isPending, navigate]);

  return null; // or loading UI
};

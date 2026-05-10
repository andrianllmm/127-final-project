import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold tracking-tight">404</h1>

        <p className="text-muted-foreground text-lg">Page not found</p>

        <Button onClick={() => navigate('/')}>Go back home</Button>
      </div>
    </div>
  );
}

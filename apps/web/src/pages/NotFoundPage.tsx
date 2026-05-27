import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="text-center space-y-6">
        <h1 className="font-heading text-3xl font-semibold text-primary-foreground">404</h1>

        <p className="text-muted-foreground text-lg">Page not found</p>

        <Button onClick={() => navigate('/')}>Go back home</Button>
      </div>
    </div>
  );
}

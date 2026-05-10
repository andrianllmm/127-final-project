import { apiClient, ApiError } from '@/shared/lib/apiClilent';
import { useEffect, useState } from 'react';

type HealthResponse = {
  status: string;
};

export const HealthPage = () => {
  const [status, setStatus] = useState<string>('Checking...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await apiClient.get<HealthResponse>('/health');

        setStatus(data.status);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`Request failed (${err.status})`);
        } else {
          setError('Request failed');
        }
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div>{error ?? `API Status: ${status}`}</div>
    </div>
  );
};

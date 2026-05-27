import { Card } from '@/shared/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, description, icon }: MetricCardProps) {
  return (
    <Card className="flex flex-col p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
        </div>
        {icon && <div className="ml-2 text-gray-400">{icon}</div>}
      </div>
    </Card>
  );
}

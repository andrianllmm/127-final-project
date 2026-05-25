import { useMemo, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card } from '@/shared/components/ui/card';

interface DateRangePickerProps {
  onRangeChange: (startDate?: string, endDate?: string) => void;
  isLoading?: boolean;
}

export function DateRangePicker({ onRangeChange, isLoading = false }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const thirtyDaysAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }, []);

  const handleApply = () => {
    onRangeChange(startDate, endDate);
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onRangeChange(undefined, undefined);
  };

  const handleLast30Days = () => {
    setStartDate(thirtyDaysAgo);
    setEndDate(today);
    onRangeChange(thirtyDaysAgo, today);
  };

  const handleLastWeek = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const sevenDaysAgo = date.toISOString().split('T')[0];
    setStartDate(sevenDaysAgo);
    setEndDate(today);
    onRangeChange(sevenDaysAgo, today);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Filter by Date Range</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Start Date</label>
            <Input
              type="date"
              value={startDate ?? ''}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">End Date</label>
            <Input
              type="date"
              value={endDate ?? ''}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApply} disabled={isLoading} className="flex-1" variant="default">
            Apply
          </Button>
          <Button onClick={handleClear} disabled={isLoading} variant="outline">
            Clear
          </Button>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="mb-2 text-xs font-medium text-gray-600">Quick Filters</p>
          <div className="flex gap-2">
            <Button onClick={handleLastWeek} disabled={isLoading} variant="outline" size="sm">
              Last 7 Days
            </Button>
            <Button onClick={handleLast30Days} disabled={isLoading} variant="outline" size="sm">
              Last 30 Days
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

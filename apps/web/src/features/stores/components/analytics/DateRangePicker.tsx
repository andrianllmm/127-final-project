import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { CalendarIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';

interface DateRangePickerProps {
  onRangeChange: (startDate?: string, endDate?: string) => void;
  value?: {
    startDate: string | undefined;
    endDate: string | undefined;
  };
  isLoading?: boolean;
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function parseDate(value?: string) {
  if (!value) return undefined;

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function DateRangePicker({ onRangeChange, value, isLoading = false }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(undefined);

  const today = useMemo(() => new Date(), []);
  const thirtyDaysAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  }, []);

  const getInitialRange = (): DateRange => ({
    from: parseDate(value?.startDate),
    to: parseDate(value?.endDate),
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);

    if (next) {
      setDraftRange(getInitialRange());
    }
  };

  const handleApply = () => {
    if (!draftRange?.from || !draftRange?.to) return;

    onRangeChange(toDateInputValue(draftRange.from), toDateInputValue(draftRange.to));

    setOpen(false);
  };

  const handleClear = () => {
    setDraftRange(undefined);
    onRangeChange(undefined, undefined);
    setOpen(false);
  };

  const handleLast30Days = () => {
    setDraftRange({ from: thirtyDaysAgo, to: today });

    onRangeChange(toDateInputValue(thirtyDaysAgo), toDateInputValue(today));

    setOpen(false);
  };

  const handleLastWeek = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);

    setDraftRange({ from: date, to: today });

    onRangeChange(toDateInputValue(date), toDateInputValue(today));

    setOpen(false);
  };

  const selectedLabel =
    value?.startDate && value?.endDate
      ? `${formatDisplayDate(parseDate(value.startDate) ?? new Date())} - ${formatDisplayDate(
          parseDate(value.endDate) ?? new Date(),
        )}`
      : 'All time';

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Date Range</h3>
        <p className="text-sm text-muted-foreground">Filter analytics by the order date window.</p>
      </div>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={isLoading}
            className={cn(
              'min-w-[18rem] justify-center gap-3 border-border/70 bg-background text-left font-normal text-foreground',
              !value?.startDate && !value?.endDate && 'text-muted-foreground',
            )}
          >
            <HugeiconsIcon icon={CalendarIcon} strokeWidth={1.8} className="size-4 text-primary" />
            <span>{selectedLabel}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={draftRange}
            onSelect={setDraftRange}
          />

          <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <Button onClick={handleLastWeek} disabled={isLoading} variant="outline" size="sm">
                Last 7 days
              </Button>
              <Button onClick={handleLast30Days} disabled={isLoading} variant="outline" size="sm">
                Last 30 days
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleClear} disabled={isLoading} variant="ghost" size="sm">
                Clear
              </Button>
              <Button
                onClick={handleApply}
                disabled={isLoading || !draftRange?.from || !draftRange?.to}
                size="sm"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

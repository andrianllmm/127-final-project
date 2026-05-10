import { cn } from '@/shared/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-0 text-2xl font-bold font-heading', className)}>
      <span className="text-primary-foreground">Mia</span>
      <span className="text-primary">Go!</span>
    </div>
  );
}

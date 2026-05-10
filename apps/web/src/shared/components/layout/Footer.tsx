import { cn } from '@/shared/lib/utils';

import { Logo } from '../brand/Logo';

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn('border-t bg-background', className)}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Brand */}
        <div>
          <div>
            <Logo className="text-xl" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="mt-2 text-xs text-muted-foreground">Food. Delivered by your community.</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} MiaGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

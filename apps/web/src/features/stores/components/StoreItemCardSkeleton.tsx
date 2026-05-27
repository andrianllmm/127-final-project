import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/components/ui/card';

export function StoreItemCardSkeleton() {
  return (
    <Card className="h-full cursor-pointer transition hover:bg-muted/50 gap-0 overflow-hidden has-[div:first-child]:pt-0">
      {/* Image */}
      <div className="overflow-hidden rounded-t-4xl rounded-b-none">
        <Skeleton className="aspect-video w-full block rounded-none" />
      </div>

      {/* Header */}
      <CardHeader className="gap-2 pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-full space-y-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <Skeleton className="h-5 w-20 shrink-0 rounded-full" />
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="mb-auto space-y-3 pt-0">
        <Skeleton className="h-6 w-24" />
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <div className="mt-auto flex w-full gap-2 pt-4">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardFooter>
    </Card>
  );
}

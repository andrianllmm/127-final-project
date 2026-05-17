import { Link } from 'react-router-dom';
import type { Store } from '@repo/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PinIcon, StoreIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link to={`/stores/${store.store_id}`} className="block">
      <Card className="h-full cursor-pointer transition hover:bg-muted/50 gap-2">
        <CardHeader>
          <div className="flex flex-row items-center gap-1 text-xl text-primary-foreground">
            <HugeiconsIcon icon={StoreIcon} size={16} />
            <CardTitle>{store.store_name}</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-row gap-1 items-center text-sm text-muted-foreground">
            <HugeiconsIcon icon={PinIcon} size={16} />
            <span className="">{store.store_address}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

import type { ReactNode } from 'react';
import type { OrderStatus, PaymentMethod } from '@repo/api';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';

export type OrderCardMode = 'customer' | 'rider' | 'vendor';

export interface OrderCardData {
  id: string;
  title: string;
  status: OrderStatus;
  referenceLabel?: string;
  referenceValue?: string;
  paymentMethod?: PaymentMethod | string;
  deliveryAddress?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  totalPrice?: number;
  itemCount?: number;
}

interface OrderCardProps {
  order: OrderCardData;
  mode: OrderCardMode;
  action?: ReactNode;
  muted?: boolean;
  className?: string;
}

function formatCurrency(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

export function OrderCard({ order, mode, action, muted = false, className }: OrderCardProps) {
  const deliveryAddress = order.deliveryAddress ?? order.dropoffLocation;
  const isRiderMode = mode === 'rider';
  const isCustomerMode = mode === 'customer' || mode === 'vendor';

  return (
    <Card
      className={cn(
        'gap-0 transition hover:-translate-y-0.5 hover:shadow-lg',
        muted && 'bg-muted/10',
        className,
      )}
    >
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{order.title}</CardTitle>
            {order.referenceValue ? (
              <CardDescription>
                {order.referenceLabel ?? 'Order'} #{order.referenceValue}
              </CardDescription>
            ) : null}
          </div>

          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 py-4">
        {isRiderMode ? (
          <>
            {order.pickupLocation ? (
              <DetailRow label="Pickup" value={order.pickupLocation} />
            ) : null}
            {deliveryAddress ? <DetailRow label="Dropoff" value={deliveryAddress} /> : null}
            {typeof order.itemCount === 'number' ? (
              <DetailRow label="Items" value={order.itemCount} />
            ) : null}
            {formatCurrency(order.totalPrice) ? (
              <DetailRow label="Total" value={formatCurrency(order.totalPrice)} />
            ) : null}
          </>
        ) : null}

        {isCustomerMode ? (
          <>
            {order.paymentMethod ? (
              <DetailRow label="Payment" value={String(order.paymentMethod).toUpperCase()} />
            ) : null}
            {deliveryAddress ? <DetailRow label="Deliver to" value={deliveryAddress} /> : null}
            {formatCurrency(order.totalPrice) ? (
              <DetailRow label="Total" value={formatCurrency(order.totalPrice)} />
            ) : null}
          </>
        ) : null}
      </CardContent>

      <CardFooter className="flex w-full flex-row gap-2">
        {action ? <div className="flex flex-1 gap-2">{action}</div> : null}

        <Button asChild variant="outline" className="flex-1">
          <Link to={`/orders/${order.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

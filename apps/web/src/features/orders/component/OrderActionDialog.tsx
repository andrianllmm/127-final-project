import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

interface OrderActionDialogProps {
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel?: string;
  isPending?: boolean;
  triggerClassName?: string;
  onConfirm: () => void;
}

export function OrderActionDialog({
  triggerLabel,
  title,
  description,
  confirmLabel,
  pendingLabel = 'Processing...',
  isPending = false,
  triggerClassName,
  onConfirm,
}: OrderActionDialogProps) {
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    onConfirm();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        className={triggerClassName}
        disabled={isPending}
        onClick={() => setOpen(true)}
      >
        {isPending ? pendingLabel : triggerLabel}
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button type="button" variant="destructive" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
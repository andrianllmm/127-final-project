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

interface DeleteStoreItemDialogProps {
  itemName: string;
  onConfirm: () => Promise<void> | void;
  triggerLabel?: string;
  triggerClassName?: string;
}

export function DeleteStoreItemDialog({
  itemName,
  onConfirm,
  triggerLabel = 'Delete',
  triggerClassName,
}: DeleteStoreItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleConfirm() {
    setIsPending(true);

    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="destructive"
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        {triggerLabel}
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete item?</DialogTitle>
          <DialogDescription>
            {`This will permanently delete ${itemName}. This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useForm } from 'react-hook-form';
import type { ReactNode } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { createStoreSchema, type CreateStoreInput } from '@repo/api';

import { Button } from '@/shared/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';

interface StoreProfileFormProps {
  submitLabel: string;
  defaultValues?: CreateStoreInput;
  onSubmit: (values: CreateStoreInput) => Promise<void> | void;
  actions?: ReactNode;
}

const EMPTY_VALUES: CreateStoreInput = {
  store_name: '',
  store_address: '',
};

export function StoreProfileForm({
  submitLabel,
  defaultValues,
  onSubmit,
  actions,
}: StoreProfileFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateStoreInput>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: defaultValues ?? EMPTY_VALUES,
  });

  async function submit(values: CreateStoreInput) {
    try {
      await onSubmit(values);
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="storeName">Store name</FieldLabel>
          <Input id="storeName" placeholder="Miagao Bites" {...register('store_name')} />
          {errors.store_name && (
            <FieldDescription className="text-destructive">
              {errors.store_name.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="storeAddress">Store address</FieldLabel>
          <Input id="storeAddress" placeholder="Miagao, Iloilo" {...register('store_address')} />
          {errors.store_address && (
            <FieldDescription className="text-destructive">
              {errors.store_address.message}
            </FieldDescription>
          )}
        </Field>

        {errors.root && (
          <FieldDescription className="text-center text-destructive">
            {errors.root.message}
          </FieldDescription>
        )}

        <Field>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>

            {actions}
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}

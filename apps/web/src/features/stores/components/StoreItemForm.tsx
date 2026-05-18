import type { ReactNode } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStoreItemSchema, type CreateStoreItemInput } from '@repo/api';

import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/shared/components/ui/input-group';

interface StoreItemFormProps {
  submitLabel: string;
  defaultValues?: Partial<CreateStoreItemInput> | undefined;
  onSubmit: (values: CreateStoreItemInput) => Promise<void> | void;
  actions?: ReactNode;
  resetOnSuccess?: boolean;
}

const EMPTY_VALUES: CreateStoreItemInput = {
  name: '',
  description: undefined,
  price: 0,
  is_available: true,
  image_url: undefined,
};

export function StoreItemForm({
  submitLabel,
  defaultValues,
  onSubmit,
  actions,
  resetOnSuccess = false,
}: StoreItemFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateStoreItemInput>({
    resolver: zodResolver(createStoreItemSchema),
    defaultValues: defaultValues ? { ...EMPTY_VALUES, ...defaultValues } : EMPTY_VALUES,
  });

  async function submit(values: CreateStoreItemInput) {
    try {
      await onSubmit(values);

      if (resetOnSuccess) {
        reset(EMPTY_VALUES);
      }
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
          <FieldLabel htmlFor="itemName">Item name</FieldLabel>
          <Input id="itemName" placeholder="Spicy Chicken Rice" {...register('name')} />
          {errors.name && (
            <FieldDescription className="text-destructive">{errors.name.message}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="itemPrice">Price</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>₱</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="itemPrice"
              step="0.01"
              min="0"
              placeholder="120.00"
              {...register('price', {
                setValueAs: (value) => {
                  if (value === '' || value === null || value === undefined) {
                    return undefined;
                  }

                  return Number(value);
                },
                onChange: (e) => {
                  const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                  e.target.value = cleaned;
                },
              })}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>PHP</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          {errors.price && (
            <FieldDescription className="text-destructive">{errors.price.message}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="itemDescription">Description</FieldLabel>
          <Textarea
            id="itemDescription"
            rows={4}
            placeholder="Short description of the item"
            {...register('description', {
              setValueAs: (value) => {
                if (typeof value !== 'string') {
                  return undefined;
                }

                const trimmed = value.trim();
                return trimmed ? trimmed : undefined;
              },
            })}
          />
          {errors.description && (
            <FieldDescription className="text-destructive">
              {errors.description.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="itemImageUrl">Image URL</FieldLabel>
          <Input
            id="itemImageUrl"
            placeholder="https://..."
            {...register('image_url', {
              setValueAs: (value) => {
                if (typeof value !== 'string') {
                  return undefined;
                }

                const trimmed = value.trim();
                return trimmed ? trimmed : undefined;
              },
            })}
          />
          {errors.image_url && (
            <FieldDescription className="text-destructive">
              {errors.image_url.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <Controller
            control={control}
            name="is_available"
            render={({ field }) => (
              <div className="flex items-center gap-3 rounded-3xl border border-border/50 bg-card px-4 py-3">
                <Checkbox
                  id="itemIsAvailable"
                  checked={field.value ?? false}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
                <div className="flex flex-col gap-0.5">
                  <FieldLabel htmlFor="itemIsAvailable">Available for ordering</FieldLabel>
                </div>
              </div>
            )}
          />
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

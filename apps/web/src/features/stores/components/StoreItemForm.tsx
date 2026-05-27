import { useEffect, useRef, useState, type ReactNode } from 'react';

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
  defaultImageUrl?: string | undefined;
  onSubmit: (values: FormData) => Promise<void> | void;
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

function sanitizePreviewUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  // Allow only image-safe URL forms for previews.
  // This avoids passing arbitrary untrusted text directly to <img src>.
  if (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }

  return null;
}

export function StoreItemForm({
  submitLabel,
  defaultValues,
  defaultImageUrl,
  onSubmit,
  actions,
  resetOnSuccess = false,
}: StoreItemFormProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(sanitizePreviewUrl(defaultImageUrl));

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

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
    };
  }, []);

  function updateSelectedImage(file: File | null) {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }

    setSelectedImage(file);

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      previewObjectUrlRef.current = objectUrl;
      setPreviewUrl(objectUrl);
      return;
    }

    setPreviewUrl(sanitizePreviewUrl(defaultImageUrl));
  }

  async function submit(values: CreateStoreItemInput) {
    try {
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('price', String(values.price));
      formData.append('is_available', String(values.is_available ?? true));

      if (values.description) {
        formData.append('description', values.description);
      }

      if (values.image_url) {
        formData.append('image_url', values.image_url);
      }

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await onSubmit(formData);

      if (resetOnSuccess) {
        reset(EMPTY_VALUES);
        updateSelectedImage(null);

        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      }
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(submit)(event);
      }}
    >
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
          <FieldLabel htmlFor="itemImage">Item image</FieldLabel>
          <Input
            ref={imageInputRef}
            id="itemImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              updateSelectedImage(event.target.files?.[0] ?? null);
            }}
          />
          <FieldDescription>
            JPEG, PNG, or WebP up to 5MB. Leave blank to keep the current image.
          </FieldDescription>

          {previewUrl && (
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
              <img
                src={previewUrl}
                alt="Selected item preview"
                className="aspect-video w-full object-cover"
              />
            </div>
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

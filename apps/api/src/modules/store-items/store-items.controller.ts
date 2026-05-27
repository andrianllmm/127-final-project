import type { Request, Response } from 'express';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import z from 'zod';
import { StoreItemsService } from './store-items.service.js';
import { AuthRequest } from '../../common/middleware/auth.middleware.js';
import { StoreItemsQuery } from '@repo/api';

function isForbiddenError(error: unknown) {
  return error instanceof Error && error.message === 'Forbidden';
}

const uploadsDir = path.join(process.cwd(), 'uploads');
const allowedImageMimeTypes = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

const requiredTextSchema = z.preprocess(
  (value) => (typeof value === 'string' ? value.trim() : value),
  z.string().min(1, 'Item name is required').max(255, 'Item name is too long'),
);

const optionalTextSchema = (maxLength: number, message: string) =>
  z.preprocess((value) => {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }, z.string().max(maxLength, message).optional());

const optionalImageUrlSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}, z.url().optional());

const priceSchema = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === 'string') {
      return Number(value);
    }

    return value;
  },
  z.number('Invalid price').min(0, 'Price must be at least 0'),
);

const availabilitySchema = z.preprocess((value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }

  return undefined;
}, z.boolean().optional());

const createStoreItemBodySchema = z.object({
  name: requiredTextSchema,
  description: optionalTextSchema(1000, 'Description is too long'),
  price: priceSchema,
  is_available: availabilitySchema,
  image_url: optionalImageUrlSchema,
});

const updateStoreItemBodySchema = z.object({
  name: requiredTextSchema.optional(),
  description: optionalTextSchema(1000, 'Description is too long'),
  price: priceSchema.optional(),
  is_available: availabilitySchema.optional(),
  image_url: optionalImageUrlSchema,
});

async function saveUploadedImage(file: Express.Multer.File) {
  const extension = allowedImageMimeTypes.get(file.mimetype);

  if (!extension) {
    throw new Error('Only jpeg, jpg, png, and webp images are allowed');
  }

  await mkdir(uploadsDir, { recursive: true });

  const filename = `${randomUUID()}${extension}`;
  const filePath = path.join(uploadsDir, filename);

  await writeFile(filePath, file.buffer);

  return {
    filename,
    filePath,
  };
}

function buildPublicImageUrl(req: Request, filename: string) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

async function removeFile(filePath?: string | null) {
  if (!filePath) {
    return;
  }

  try {
    await unlink(filePath);
  } catch (error) {
    if (!(error instanceof Error) || (error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

export class StoreItemsController {
  private service = new StoreItemsService();

  getAll = async (req: Request<unknown, unknown, unknown, StoreItemsQuery>, res: Response) => {
    try {
      const data = await this.service.getAll({
        storeId: req.query.storeId,
        keyword: req.query.keyword,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        priceMin: req.query.priceMin,
        priceMax: req.query.priceMax,
        available: req.query.available,
      });

      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      return res.json(data);
    } catch (error) {
      if (isForbiddenError(error)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      throw error;
    }
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { itemId } = req.params as { itemId: string };
      const data = await this.service.getById(itemId);

      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      return res.json(data);
    } catch (error) {
      if (isForbiddenError(error)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      throw error;
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest & { file?: Express.Multer.File };
    let uploadedFilePath: string | null = null;

    try {
      const parsedBody = createStoreItemBodySchema.parse(req.body);
      const uploadedImage = authReq.file ? await saveUploadedImage(authReq.file) : null;

      uploadedFilePath = uploadedImage?.filePath ?? null;

      const result = await this.service.create(authReq.user!.id, {
        ...parsedBody,
        image_url: uploadedImage
          ? buildPublicImageUrl(req, uploadedImage.filename)
          : parsedBody.image_url,
      });

      if (!result) {
        await removeFile(uploadedFilePath);
        return res.status(404).json({ message: 'Not found' });
      }

      return res.status(201).json(result);
    } catch (error) {
      await removeFile(uploadedFilePath);

      if (isForbiddenError(error)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request body', issues: error.issues });
      }

      throw error;
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest & { file?: Express.Multer.File };
    let uploadedFilePath: string | null = null;

    try {
      const { itemId } = z.object({ itemId: z.uuid() }).parse(req.params);
      const parsedBody = updateStoreItemBodySchema.parse(req.body);
      const uploadedImage = authReq.file ? await saveUploadedImage(authReq.file) : null;

      uploadedFilePath = uploadedImage?.filePath ?? null;

      const result = await this.service.update(authReq.user!.id, itemId, {
        ...parsedBody,
        ...(uploadedImage ? { image_url: buildPublicImageUrl(req, uploadedImage.filename) } : {}),
      });

      if (!result) {
        await removeFile(uploadedFilePath);
        return res.status(404).json({ message: 'Not found' });
      }

      return res.json(result);
    } catch (error) {
      await removeFile(uploadedFilePath);

      if (isForbiddenError(error)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request body', issues: error.issues });
      }

      throw error;
    }
  };

  delete = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const { itemId } = req.params as { itemId: string };
      const result = await this.service.delete(req.user!.id, itemId);

      if (!result) {
        return res.status(404).json({ message: 'Not found' });
      }

      return res.status(204).send();
    } catch (error) {
      if (isForbiddenError(error)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      throw error;
    }
  };
}

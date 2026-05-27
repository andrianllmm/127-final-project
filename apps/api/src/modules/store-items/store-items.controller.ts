import type { Request, Response } from 'express';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import z from 'zod';
import os from 'node:os';
import { createStoreItemSchema, updateStoreItemSchema } from '@repo/api';
import { StoreItemsService } from './store-items.service.js';
import { AuthRequest } from '../../common/middleware/auth.middleware.js';
import { StoreItemsQuery } from '@repo/api';

function isForbiddenError(error: unknown) {
  return error instanceof Error && error.message === 'Forbidden';
}

const uploadsDir = process.env.UPLOADS_DIR ?? path.join(os.tmpdir(), 'miago-uploads');
const allowedImageMimeTypes = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

function preprocessCreateBody(body: any) {
  return {
    name: typeof body.name === 'string' ? body.name.trim() : body.name,
    description:
      typeof body.description === 'string' ? body.description.trim() || undefined : undefined,
    price: body.price === undefined || body.price === '' ? undefined : Number(body.price),
    is_available:
      typeof body.is_available === 'boolean'
        ? body.is_available
        : typeof body.is_available === 'string'
          ? body.is_available === 'true'
          : undefined,
    image_url: typeof body.image_url === 'string' ? body.image_url.trim() || undefined : undefined,
  };
}

function preprocessUpdateBody(body: any) {
  const out: Record<string, unknown> = {};

  if (Object.prototype.hasOwnProperty.call(body, 'name')) {
    out.name = typeof body.name === 'string' ? body.name.trim() : body.name;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'description')) {
    out.description =
      typeof body.description === 'string' ? body.description.trim() || undefined : undefined;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'price')) {
    out.price = body.price === '' || body.price === undefined ? undefined : Number(body.price);
  }

  if (Object.prototype.hasOwnProperty.call(body, 'is_available')) {
    const v = body.is_available;
    out.is_available =
      typeof v === 'boolean' ? v : v === 'true' ? true : v === 'false' ? false : undefined;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'image_url')) {
    out.image_url =
      typeof body.image_url === 'string' ? body.image_url.trim() || undefined : undefined;
  }

  return out;
}

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
      const pre = preprocessCreateBody(req.body);
      const parsedBody = createStoreItemSchema.parse(pre);
      const uploadedImage = authReq.file ? await saveUploadedImage(authReq.file) : null;

      uploadedFilePath = uploadedImage?.filePath ?? null;

      const createInput = {
        ...parsedBody,
        image_url: uploadedImage
          ? buildPublicImageUrl(req, uploadedImage.filename)
          : parsedBody.image_url,
      };

      const result = await this.service.create(authReq.user!.id, createInput);

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
      const pre = preprocessUpdateBody(req.body);
      const parsedBody = updateStoreItemSchema.parse(pre);
      const uploadedImage = authReq.file ? await saveUploadedImage(authReq.file) : null;

      uploadedFilePath = uploadedImage?.filePath ?? null;

      const updatePayload: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(parsedBody)) {
        if (value !== undefined) updatePayload[key] = value;
      }
      if (uploadedImage) {
        updatePayload.image_url = buildPublicImageUrl(req, uploadedImage.filename);
      }

      const result = await this.service.update(authReq.user!.id, itemId, updatePayload as any);

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

import type { RequestHandler } from "express";
import { z } from "zod";

const searchQuerySchema = z.object({ q: z.string().trim().min(1).max(120) });
const playlistBodySchema = z.object({ playListName: z.string().trim().min(1).max(80) });
const uploadBodySchema = z.object({
  title: z.string().trim().min(1).max(120),
  genre: z.string().trim().min(1).max(60),
  albumName: z.string().trim().max(120).optional(),
  featuredArtists: z.string().trim().max(240).optional(),
  description: z.string().trim().max(2000).optional(),
  releaseDate: z.string().max(40).optional(),
  visibility: z.enum(["Public", "Private", "Scheduled"]).optional(),
  duration: z.coerce.number().finite().positive().max(86400).optional(),
});

function validate<T>(schema: z.ZodType<T>, getData: (request: Parameters<RequestHandler>[0]) => unknown, assignBody = false): RequestHandler {
  return (request, response, next) => {
    const result = schema.safeParse(getData(request));
    if (!result.success) return response.status(400).json({ message: "Request data is invalid", issues: result.error.issues.map(({ path, message }) => ({ path, message })) });
    if (assignBody) request.body = result.data;
    return next();
  };
}

export const validateSearchQuery = validate(searchQuerySchema, (request) => request.query);
export const validatePlaylistBody = validate(playlistBodySchema, (request) => request.body, true);
export const validateUploadBody = validate(uploadBodySchema, (request) => request.body, true);

export default { validateSearchQuery, validatePlaylistBody, validateUploadBody };

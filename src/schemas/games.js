import { z } from "zod";

class GameError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
  }
}

export const gameSchema = z.object({
  name: z.string(),
  genre: z.string(),
  description: z.string().optional(),
  image_url: z.string().url('O campo "image_url" deve ser um link.'),
});

export function validateGameData(data) {
  try {
    const validData = gameSchema.parse(data);
    return validData;
  } catch (e) {
    const errors = [];
    e.issues.forEach((err) =>
      errors.push({ field: err.path[0], message: err.message })
    );
    throw new GameError("Invalid Body", errors);
  }
}

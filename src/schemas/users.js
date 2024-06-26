import { z } from "zod";

class UserError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
  }
}

export const loginUserSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(8, "A senha deve conter pelo menos 8 digitos."),
});

export function validateLoginUserData(data) {
  try {
    const validData = loginUserSchema.parse(data);
    return validData;
  } catch (e) {
    const errors = [];
    e.issues.forEach((err) =>
      errors.push({ field: err.path[0], message: err.message })
    );
    throw new UserError("Invalid Body", errors);
  }
}

export const registerUserSchema = z
  .object({
    email: z.string().email("Email inválido."),
    password: z.string().min(8, "A senha deve conter pelo menos 8 digitos"),
    confirmPassword: z
      .string()
      .min(8, "A confirmação da senha deve ter pelo menos 8 digitos"),
  })
  .refine(({ password, confirmPassword }) => password == confirmPassword, {
    message: "A senha e a confirmação de senha devem ser iguais.",
  });

export function validateRegisterUserData(data) {
  try {
    const validData = registerUserSchema.parse(data);
    return validData;
  } catch (e) {
    const errors = [];
    e.issues.forEach((err) =>
      errors.push({ field: err.path[0], message: err.message })
    );
    throw new UserError("Invalid Body", errors);
  }
}

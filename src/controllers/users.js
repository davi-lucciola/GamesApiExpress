import "dotenv/config";
import {
  validateLoginUserData,
  validateRegisterUserData,
} from "../schemas/users.js";
import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import { prisma } from "../db.js";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";

const JWT_SECRET = process.env.JWT_SECRET;
const router = Router();

router.post("/users/login", async (req, res) => {
  let data;
  try {
    data = validateLoginUserData(req.body);
  } catch (err) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      message: err.message,
      errors: err.errors,
    });
  }

  const { email, password } = data;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      code: "NOT_FOUND",
      message: "Credenciais Inválidas.",
    });
  }

  const passwordsMatch = await bycrypt.compare(password, user.password);

  if (!passwordsMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      code: "NOT_FOUND",
      message: "Credenciais Inválidas.",
    });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: 60 * 60 * 5, // 5 Hours
  });

  return res.status(StatusCodes.OK).json({
    type: "bearer",
    token: token,
  });
});

router.post("/users/register", async (req, res) => {
  let data;
  try {
    data = validateRegisterUserData(req.body);
  } catch (err) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      message: err.message,
      errors: err.errors,
    });
  }

  const { email, password } = data;
  const hashPassword = await bycrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: hashPassword,
    },
  });

  return res.status(StatusCodes.CREATED).json({
    code: "USER_CREATED",
    message: "Usuário cadastrado com sucesso.",
    createdId: newUser.id,
  });
});

export { router };

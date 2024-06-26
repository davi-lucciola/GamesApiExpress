import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { validateGameData } from "../schemas/games";

const router = Router();
const prisma = new PrismaClient();

// Get all games
router.get("/games", async (req, res) => {
  const games = await prisma.game.findMany();

  if (games.length < 1) {
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  return res.status(StatusCodes.OK).json(games);
});

// Get one game
router.get("/games/:gameId", async (req, res) => {
  const gameId = parseInt(req.params["gameId"]);

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
  });

  if (game === null) {
    return res.status(StatusCodes.NOT_FOUND).json({
      code: "NOT_FOUND",
      message: "Não foi encontrado um jogo com esse identificador.",
    });
  }

  return res.json(game);
});

// Create new game
router.post("/games", async (req, res) => {
  let data;
  try {
    data = validateGameData(req.body);
  } catch (err) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      message: err.message,
      errors: err.errors,
    });
  }

  const { name, genre, description, image_url } = data;

  const game = await prisma.game.create({
    data: {
      name: name,
      genre: genre,
      description: description,
      image_url: image_url,
    },
  });

  return res.status(StatusCodes.CREATED).json({
    code: "GAME_CREATED",
    message: "Jogo cadastrado com sucesso.",
    created_id: game.id,
  });
});

// Update Game
router.put("/games/:gameId", async (req, res) => {
  const gameId = parseInt(req.params["gameId"]);
  console.log(gameId);
  const gameToEdit = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
  });

  console.log(gameToEdit);

  if (gameToEdit === null) {
    return res.status(StatusCodes.NOT_FOUND).json({
      code: "NOT_FOUND",
      message: "Não existe jogo com esse id",
    });
  }

  let data;
  try {
    data = validateGameData(req.body);
  } catch (err) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      message: err.message,
      errors: err.errors,
    });
  }

  const { name, genre, description, image_url } = data;

  await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      name: name,
      genre: genre,
      description: description,
      image_url: image_url,
    },
  });

  return res.status(StatusCodes.CREATED).json({
    code: "GAME_UPDATED",
    message: "Jogo alterado com sucesso.",
  });
});

// Delete Game
router.delete("/games/:gameId", async (req, res) => {
  const gameId = parseInt(req.params["gameId"]);
  const gameToDelete = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
  });

  if (gameToDelete === null) {
    return res.status(StatusCodes.NOT_FOUND).json({
      code: "NOT_FOUND",
      message: "Não existe jogo com esse id",
    });
  }

  await prisma.game.delete({
    where: {
      id: gameId,
    },
  });

  return res.status(StatusCodes.ACCEPTED).json({
    code: "GAME_DELETED",
    message: "Jogo excluido com sucesso.",
  });
});

export { router };

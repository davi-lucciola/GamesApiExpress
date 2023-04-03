import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";


const prisma = new PrismaClient();

const router = Router();


// Get all games
router.get('/games', async (req, res) => {
    const games = await prisma.game.findMany();
    if (games.length < 1) {
        return res.status(StatusCodes.NO_CONTENT).send();
    }
    return res.status(StatusCodes.OK).json(games);
});

// Get one game
router.get('/games/:gameId', async (req, res) => {
    const gameId = parseInt(req.params['gameId']);

    const game = await prisma.game.findUnique({
        where: {
            id: gameId
        }
    });

    if (game === null) {
        return res.status(StatusCodes.NOT_FOUND).json({
            code: 'NOT_FOUND',
            message: 'Não existe jogo com esse id'
        });
    }

    return res.json(game);
});

// Create new game
router.post('/games', async (req, res) => {
    const { name, genre } = req.body;

    const game = await prisma.game.create({
        data: {
            name: name,
            genre: genre
        }
    });

    return res.status(StatusCodes.CREATED).json({
        code:'GAME_CREATED',
        message: 'Jogo cadastrado com sucesso.',
        created_id: game.id
    });
});

// Update Game
router.put('/games/:gameId', async (req, res) => {
    const game_to_edit = prima.game.findUnique({
        where: {
            id: parseInt(gameId)
        }
    });

    if (game === null) {
        return res.status(StatusCodes.NOT_FOUND).json({
            code: 'NOT_FOUND',
            message: 'Não existe jogo com esse id'
        });
    }

    const { name, genre } = req.body;
    const updated_games = prima.games.update({
        where: {
            id: game_to_edit.id
        },
        data: {
            name: name,
            genre: genre
        }
    })
    return res.status(StatusCodes.CREATED).json({
        code:'GAME_UPDATED',
        message: 'Jogo alterado com sucesso.',
        created_id: game.id
    });
});

// Delete Game
router.delete('/games/:gameId', async (req, res) => {
    const game_to_delete = prisma.game.findUnique({
        where: {
            id: parseInt(gameId)
        }
    });

    if (game === null) {
        return res.status(StatusCodes.NOT_FOUND).json({
            code: 'NOT_FOUND',
            message: 'Não existe jogo com esse id'
        });
    }

    const deleted_game = prisma.game.delete({
        where: {
            id: game_to_delete.id
        }
    });

    return res.status(StatusCodes.ACCEPTED).json({
        code: 'GAME_DELETED',
        message: 'Jogo Deletado com Sucesso.'
    });
});

export { router };

import express from 'express';
import { router } from './controllers/games'


const app = express();
app.use(express.json());
app.use(router)

app.get('/info', async (req, res) => {
    return res.json({
        title: 'games-api-express',
        by: 'Davi Lucciola'
    })
})

app.listen(3030, () => console.log('Server is running...'));

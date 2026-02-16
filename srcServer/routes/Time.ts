import express  from 'express';
import crypto from 'crypto';
import { time } from 'console';

let times = [];

const router = express.Router();


router.post('/time', async (req, res) => {
try {
    const { startTime, endTime } = req.body;
    if(!startTime) {
        return res.status(400).send({ error: "StartTime krävs" });
    }

    const newTime = {
        id: crypto.randomUUID(),
        startTime,
        endTime: endTime || null,
        createdAt: new Date().toISOString(),
    };

    times.push(newTime)

    res.status(201).send({ 
        message: "Tid skapd",
        data: newTime,
    });

    } catch (error) {
        res.status(500).send({ error: "Något gick fel!" });
    }
});

router.get('/time', async (req, res) => {

});

//Om tid finns
router.put('/time/id', async (req, res) => {

});

export default router;
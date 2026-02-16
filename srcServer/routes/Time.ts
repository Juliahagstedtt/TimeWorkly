import express  from 'express';
import crypto from 'crypto';
import type { TimeEntry } from '../data/middleware.js';

let times: TimeEntry[] = []; 

const router = express.Router();


router.post('/time/manual', async (req, res) => {
try {
    const { startTime, endTime } = req.body;
    if(!startTime || !endTime) {
        return res.status(400).send({ error: "StartTid och SlutTid krävs" });
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
    try {
        res.status(200).send({ 
            success: true,
            data: times,
        });   
    } catch (error) {
        res.status(500).send({ error: "Något gick fel vid hämtning av tiden!" });
        }
});

router.post('/time/clock-in', async (req, res) => {
    try {
        const newTime: TimeEntry = {
        id: crypto.randomUUID(),
        startTime: new Date().toISOString(),
        endTime: null,
        createdAt: new Date().toISOString(),
        };

    times.push(newTime);

    res.status(201).send({
        message: "In stämålad",
        data: newTime,
    });

   } catch (error) {
    res.status(500).send({ error: "Något gick fel!" });
  } 
});


router.put('/time/:id/clock-out', async (req, res) => {
    try {
    const { id } = req.params;

    const time = times.find(t => t.id === id);

    if (!time) {
      return res.status(404).send({ error: "Tid hittades inte" });
    }

    if (time.endTime) {
      return res.status(400).send({ error: "Redan utstämplad" });
    }

    time.endTime = new Date().toISOString();

    res.status(200).send({
      message: "Utstämplad",
      data: time,
    });

  } catch (error) {
    res.status(500).send({ error: "Något gick fel!" });
  }
});

export default router;
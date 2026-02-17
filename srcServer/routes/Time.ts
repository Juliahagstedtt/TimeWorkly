import express  from 'express';
import crypto from 'crypto';
import type { AuthRequest, TimeEntry } from '../data/middleware.js';
import { checkAuth } from '../data/middleware.js';
import { Temporal } from '@js-temporal/polyfill';

let times: TimeEntry[] = []; 

const router = express.Router();


router.post('/time/manual', checkAuth, async (req: AuthRequest, res) => {
try {
    const { startTime, endTime } = req.body;
    if(!startTime || !endTime) {
        return res.status(400).send({ error: "StartTid och SlutTid krävs" });
    }

    const start = Temporal.Instant.from(startTime);
    const end = Temporal.Instant.from(endTime);

    if (end < start) {
        return res.status(400).send({ error: "SlutTid måste vara efter StartTid" });
    }

    const newTime: TimeEntry = {
        id: crypto.randomUUID(),
        startTime,
        userId: req.userId!,
        endTime: endTime || null,
        createdAt: Temporal.Now.instant().toString(),
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

router.get('/time', checkAuth, async (req: AuthRequest, res) => {
    try {
        const userTimes = times.filter(
        (time) => time.userId === req.userId
        );

        res.status(200).send({ 
            success: true,
            data: userTimes,
        });   

    } catch (error) {
        res.status(500).send({ error: "Något gick fel vid hämtning av tiden!" });
        }
});

router.post('/time/clock-in', checkAuth, async (req: AuthRequest, res) => {
    try {
        const now = Temporal.Now.instant();

        const newTime: TimeEntry = {
        id: crypto.randomUUID(),
        startTime: now.toString(),
        userId: req.userId!,
        endTime: null,
        createdAt: now.toString(),
        };

    times.push(newTime);

    res.status(201).send({
        message: "In stämplad",
        data: newTime,
    });

   } catch (error) {
    res.status(500).send({ error: "Något gick fel!" });
  } 
});


router.put('/time/:id/clock-out', checkAuth, async (req: AuthRequest, res) => {
    try {
    const { id } = req.params;

    const time = times.find(
    t => t.id === id && t.userId === req.userId
    );
    
    if (!time) {
      return res.status(404).send({ error: "Tid hittades inte" });
    }

    if (time.endTime) {
      return res.status(400).send({ error: "Redan utstämplad" });
    }

    time.endTime = Temporal.Now.instant().toString();

    res.status(200).send({
      message: "Utstämplad",
      data: time,
    });

  } catch (error) {
    res.status(500).send({ error: "Något gick fel!" });
  }
});

export default router;
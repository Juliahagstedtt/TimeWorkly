import express  from 'express';
import crypto from 'crypto';
import { PutCommand, QueryCommand, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import type { AuthRequest } from '../data/middleware.js';
import db, { myTable } from "../data/dynamoDB.js";
import { checkAuth } from '../data/middleware.js';
import { Temporal } from '@js-temporal/polyfill';

const router = express.Router();


router.post('/time/manual', checkAuth, async (req: AuthRequest, res) => {
try {
    const { startTime, endTime } = req.body;
    console.log("USERID:", req.userId);

    if(!startTime || !endTime) {
        return res.status(400).send({ error: "StartTid och SlutTid krävs" });
    }

    const start = Temporal.Instant.from(startTime);
    const end = Temporal.Instant.from(endTime);

    if (Temporal.Instant.compare(end, start) < 0) {
        return res.status(400).send({ error: "SlutTid måste vara efter StartTid" });
    }

    const id = crypto.randomUUID();


    const newTime = {
        Pk: `USER#${req.userId}`,
        Sk: `TIME#${id}`,
        id,
        startTime,
        userId: req.userId!,
        endTime: endTime,
        createdAt: Temporal.Now.instant().toString(),
        inputType: 'manual',
        type: "time",
    };

    await db.send(new PutCommand({ TableName: myTable, Item: newTime }));
        res.status(201).send({ message: "Tid skapad", data: newTime });
      } catch (error) {
        res.status(500).send({ error: "Något gick fel!" });
        console.log(error);
    }
});

router.get('/time', checkAuth, async (req: AuthRequest, res) => {
    try {
    const result  = await db.send(new QueryCommand({
        TableName: myTable,
        KeyConditionExpression: "Pk = :pk AND begins_with(Sk, :tid)",
        ExpressionAttributeValues: {
            ":pk": `USER#${req.userId}`,
            ":tid": "TIME#",
        },
      })
    );

        res.status(200).send({ 
            success: true,
            data: result.Items ?? [] ,
        });   

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Något gick fel vid hämtning av tiden!" });
    }
});

router.post('/time/clock-in', checkAuth, async (req: AuthRequest, res) => {
    try {
        const now = Temporal.Now.instant().toString();
        const id = crypto.randomUUID();

        const newTime = {
        Pk: `USER#${req.userId}`,
        Sk: `TIME#${id}`,
        id,
        startTime: now,
        endTime: null,
        createdAt: now,
        inputType: "clock-in",
        type: "time",        
        };


    await db.send(new PutCommand({ TableName: myTable, Item: newTime }));

    res.status(200).send({
        message: "In stämplad",
        data: newTime,
    });

   } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Något gick fel!" });
  } 
});


router.put('/time/:id/clock-out', checkAuth, async (req: AuthRequest, res) => {
    try {
    const { id } = req.params;

    const result = await db.send(new GetCommand({
      TableName: myTable,
      Key: {
        Pk: `USER#${req.userId}`,
        Sk: `TIME#${id}`,
      },
    }));

    const timeItem = result.Item;

    if (!timeItem) {
      return res.status(404).send({ error: "Tid hittades inte" });
    }

    if (timeItem.endTime) {
      return res.status(400).send({ error: "Redan utstämplad" });
    }

    const now = Temporal.Now.instant().toString();

    await db.send(new UpdateCommand({
      TableName: myTable,
      Key: {
        Pk: timeItem.Pk,
        Sk: timeItem.Sk,
      },
      UpdateExpression: "SET endTime = :endTime",
      ExpressionAttributeValues: {
        ":endTime": now,
      },
    }));

    timeItem.endTime = now;


    res.status(200).send({
      message: "Utstämplad",
      data: timeItem,
    });

  } catch (error) {
    res.status(500).send({ error: "Något gick fel!" });
  }
});

export default router;
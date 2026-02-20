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

      const items = result.Items ?? [];

      let totalMinutes = 0;
      let isClockedIn = false;

      for (const item of items) {

      if (!item.endTime) {
        isClockedIn = true;
      }

          if (item.startTime && item.endTime) {
        const start = Temporal.Instant.from(item.startTime);
        const end = Temporal.Instant.from(item.endTime);
        const diff = end.since(start).total({ unit: "minutes" });
        totalMinutes += diff;
      }
    }
        res.status(200).send({ 
            success: true,
            data: items,
            totalMinutes,
            isClockedIn,
        });   

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Något gick fel vid hämtning av tiden!" });
    }
});

router.post('/time/clock-in', checkAuth, async (req: AuthRequest, res) => {
    try {
        const existing = await db.send(new QueryCommand({
          TableName: myTable,
          KeyConditionExpression: "Pk = :pk AND begins_with(Sk, :sk)",
          FilterExpression: "attribute_not_exists(endTime)",
          ExpressionAttributeValues: {
            ":pk": `USER#${req.userId}`,
            ":sk": "TIME#",
          },
        }));

if (existing.Items && existing.Items.length > 0) {
  const oldTime = existing.Items[0]!;
  await db.send(new UpdateCommand({
    TableName: myTable,
    Key: { Pk: oldTime.Pk, Sk: oldTime.Sk },
    UpdateExpression: "SET endTime = :now",
    ExpressionAttributeValues: { ":now": Temporal.Now.instant().toString() },
  }));
}
            
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


router.put('/time/clock-out', checkAuth, async (req: AuthRequest, res) => {
    try {
    const result = await db.send(new QueryCommand({
      TableName: myTable,
      KeyConditionExpression: "Pk = :pk AND begins_with(Sk, :sk)",
      FilterExpression: "endTime = :nullValue",
      ExpressionAttributeValues: {
        ":pk": `USER#${req.userId}`,
        ":sk": "TIME#",
        ":nullValue": null
      },
    }));

    const items = result.Items ?? [];
    
    if (items.length === 0) {
      return res.status(400).send({ error: "Ingen aktiv tid att stämpla ut." });
    }

    const timeItem = items[0]!;
    const now = Temporal.Now.instant().toString();

    await db.send(new UpdateCommand({
      TableName: myTable,
      Key: { Pk: timeItem.Pk, Sk: timeItem.Sk },
      UpdateExpression: "SET endTime = :endTime",
      ExpressionAttributeValues: { ":endTime": now },
    }));

    timeItem.endTime = now;
    
    res.status(200).send({
      message: "Utstämplad",
      data: timeItem,
    });


  } catch (error) {
    console.log("User ID:", req.userId)
    res.status(500).send({ error: "Något gick fel!" });
  }
});


export default router;
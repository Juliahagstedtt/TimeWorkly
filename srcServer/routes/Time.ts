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
    const { startTime, endTime, breakMinutes = 0 } = req.body; // Hämta data från req body

    // Kontrollera att tider finns
    if(!startTime || !endTime) {
        return res.status(400).send({ error: "StartTid och SlutTid krävs" });
    }

    // Raster kan inte vara negativa
    if (breakMinutes < 0) {
      return res.status(400).send({ error: "Raster kan inte vara negativa." });
    }

    // Konverterar ISO tider till Temporal Instant
    // Instant är exakt tidpunkt i UTC
    const start = Temporal.Instant.from(startTime);
    const end = Temporal.Instant.from(endTime);

    // Konvertera tider till Temporal Instant
    const diffMinutes = end.since(start).total({ unit: "minutes" });

    // Validering för att inte stämpla in en slut tid som är före start tid.
    if (diffMinutes <= 0) {
      return res.status(400).send({ error: "SlutTid måste vara efter StartTid" });
    }

    if (diffMinutes < 1) {
      return res.status(400).send({ error: "Arbetspasset måste vara minst 1 minut" });
    }

    // Skapa unikt ID
    const id = crypto.randomUUID();

    // objekt sparas i DB
    const newTime = {
        Pk: `USER#${req.userId}`,
        Sk: `TIME#${id}`,
        id,
        startTime,
        userId: req.userId!,
        endTime: endTime,
        breakMinutes,
        createdAt: Temporal.Now.instant().toString(),
        inputType: 'manual',
        type: "time",
    };

    // Spara i databasen
    await db.send(new PutCommand({ 
      TableName: myTable, 
      Item: newTime 
    }));

        res.status(201).send({ message: "Tid skapad", data: newTime });
      } catch (error) {
        res.status(500).send({ error: "Något gick fel!" });
        console.log(error);
    }
});

router.get('/time', checkAuth, async (req: AuthRequest, res) => {
    try {
      // Query (alltså hämta) alla tider för användaren
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

      // Loopa igenom tider
      for (const item of items) {

      // Kontrollera om användaren är in stämplad
      if (!item.endTime) {
        isClockedIn = true;
      }

      // Beräkna arbetad tid
          if (item.startTime && item.endTime) {
              const start = Temporal.Instant.from(item.startTime);
              const end = Temporal.Instant.from(item.endTime);
              const diff = end.since(start).total({ unit: "minutes" });
              const breakMinutes = item.breakMinutes ?? 0;

              const workedMinutes = diff - breakMinutes;

              totalMinutes += workedMinutes > 0 ? workedMinutes : 0;
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
          // Kontrollera om det redan finns en aktiv tid
        const existing = await db.send(new QueryCommand({
          TableName: myTable,
          KeyConditionExpression: "Pk = :pk AND begins_with(Sk, :sk)",
          FilterExpression: "attribute_not_exists(endTime)",
          ExpressionAttributeValues: {
            ":pk": `USER#${req.userId}`,
            ":sk": "TIME#",
          },
        }));

        // Om en aktiv tid finns, stäng den
        if (existing.Items && existing.Items.length > 0) {
          const oldTime = existing.Items[0]!;
          await db.send(new UpdateCommand({
            TableName: myTable,
            Key: { 
            Pk: oldTime.Pk, 
            Sk: oldTime.Sk },
            UpdateExpression: "SET endTime = :now",
            ExpressionAttributeValues: { ":now": Temporal.Now.instant().toString() },
          }));
        }
            
        // Hämtar nuvarande tid i UTC
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

    // Spara nytt arbetspass i DB
    await db.send(new PutCommand({
       TableName: myTable, 
       Item: newTime 
      }));

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
    // Hämta aktivt arbetspass
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
    const now = Temporal.Now.instant().toString(); // Hämtar nuvarande tid i UTC

    // Uppdatera sluttiden
    await db.send(new UpdateCommand({
      TableName: myTable,
      Key: { 
        Pk: timeItem.Pk, 
        Sk: timeItem.Sk },
      UpdateExpression: "SET endTime = :endTime",
      ExpressionAttributeValues: { ":endTime": now },
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


router.put('/time/:id', checkAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, breakMinutes = 0 } = req.body;

    // Kontrollera att tider finns
    if (!startTime || !endTime) {
      return res.status(400).send({ error: "StartTid och SlutTid krävs" });
    }

    // Konverterar ISO tider till Temporal Instant
    const start = Temporal.Instant.from(startTime);
    const end = Temporal.Instant.from(endTime);

    // Sluttid måste vara efter start
    if (Temporal.Instant.compare(end, start) < 0) {
      return res.status(400).send({ error: "SlutTid måste vara efter StartTid" });
    }

    // Kontrollera att posten finns
    const existing = await db.send(new GetCommand({
      TableName: myTable,
      Key: {
        Pk: `USER#${req.userId}`,
        Sk: `TIME#${id}`,
      },
    }));

    if (!existing.Item) {
      return res.status(404).send({ error: "Tiden hittades inte" });
    }

    // Uppdatera posten/passet
    await db.send(new UpdateCommand({
      TableName: myTable,
      Key: {
        Pk: `USER#${req.userId}`,
        Sk: `TIME#${id}`,
      },
      UpdateExpression: 
      `SET startTime = :startTime,
            endTime = :endTime,
            breakMinutes = :breakMinutes,
            updatedAt = :updatedAt
      `,
      ExpressionAttributeValues: {
        ":startTime": startTime,
        ":endTime": endTime,
        ":breakMinutes": breakMinutes,
        ":updatedAt": Temporal.Now.instant().toString(),
      },
    }));

    res.status(200).send({
      message: "Tiden uppdaterad",
      id,
      startTime,
      endTime,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Något gick fel!" });
  }
});


export default router;
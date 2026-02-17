import express  from 'express';
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import db, { myTable } from '../data/dynamoDB.js';
import { userPostSchema } from '../data/types.js';
import { createToken } from '../data/Jwt.js';
import bcrypt from 'bcrypt';
import crypto from "crypto";

const router = express.Router();


router.post('/register', async (req, res) => {
    const parsed = userPostSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).send({ error: "Ogiltig information" });
    }

    const { username, password } = parsed.data;
    const passwordHash = await bcrypt.hash(password, 10);

    // Skapa Unik Id
    const userId = crypto.randomUUID();

    // Item som sparas i DynamoDb
    const userItem = {
        Pk: `USER#${userId}`,
        Sk: `PROFILE`,
        username: username,
        password: passwordHash,
        type: 'user',
    };

    // Kontrollera om användarnamnet redan finns
    const exist = await db.send(new ScanCommand({
        TableName: myTable,
        FilterExpression: "#u = :u",
        ExpressionAttributeNames: { "#u": "username" },
        ExpressionAttributeValues: { ":u": username }
    }));

    if ((exist.Items ?? []).length > 0) {
        return res.status(409).send({ error: "Användarnamnet är upptaget" });
    }

    try {
        const command = new PutCommand({
            TableName: myTable,
            Item: userItem
        });
        await db.send(command);

        const token = createToken(userId); 
   
    res.status(201).send({ 
        success: true,
        message: 'Användare skapad!',
        userId: userId,
        username: username,
        token
    });

 } catch (error) {
    console.log('Fel vid registrering', error);
    res.status(500).send({ message: 'Kunde inte registrera användare' });
 }
});

export default router;
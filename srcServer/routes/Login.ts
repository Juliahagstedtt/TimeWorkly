import express  from 'express';
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import db, { myTable } from '../data/dynamoDB.js';
import { userSchema, userPostSchema } from '../data/types.js';
import { createToken } from '../data/Jwt.js';
import bcrypt from 'bcrypt';

const router = express.Router();


router.post('/login', async (req, res) => {
   try {  
    const parsed = userPostSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).send({ error: "Ogiltig information" });
    }

    const { username, password } = parsed.data;
   
        const command = new ScanCommand({
            TableName: myTable,
            FilterExpression: "#u = :username",
            ExpressionAttributeNames: { "#u": "username" },
            ExpressionAttributeValues: { ":username": username }
        });
   
        const result = await db.send(command);

    if (!result.Items || result.Items.length === 0) {
        return res.status(404).send({ error: "Användaren finns inte" });
    }
    const user = userSchema.parse(result.Items[0]);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send({ error: "Fel lösenord" });

    const uuid = user.Pk.startsWith('USER#') ? user.Pk.substring(5) : user.Pk


    const token = createToken(uuid);


    res.status(201).send({ 
        success: true,
        message: 'Inloggningen lyckades!',
        userId: uuid,
        username: user.username,
        token
    });

 } catch (error) {
    console.log('Fel vid inloggning', error);
    res.status(500).send({ message: 'Något gick fel vid inloggning' });
 }
});

export default router;
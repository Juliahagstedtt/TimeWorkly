import express  from 'express';
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { myTable } from '../data/dynamoDB.js';

const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const command = new ScanCommand({
            TableName: myTable
        })
    }

});
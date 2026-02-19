import express from 'express';
import cors from 'cors';
import userRoute from './routes/Register.js'
import loginRoute from './routes/Login.js'
import timeRouter from './routes/Time.js'

const app = express();
const port = Number(process.env.PORT) || 10000;

app.use(cors())
app.use(express.json());


app.use('/', userRoute); 
app.use('/', loginRoute); 
app.use('/', timeRouter);


app.listen(port, () => {
  console.log(`Server listening on port ...${port}`);
});
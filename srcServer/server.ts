import express from 'express';
import userRoute from './routes/Register.js'

const app = express();
const port = Number(process.env.PORT) || 10000;


app.use(express.json());

app.use('/', userRoute); 

app.listen(port, () => {
  console.log(`Server listening on port ...${port}`);
});
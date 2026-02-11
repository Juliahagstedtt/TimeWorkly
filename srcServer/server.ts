import express from 'express';

const app = express();
// const port = Number(process.env.PORT) || 10000;

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
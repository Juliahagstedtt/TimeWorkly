import express from 'express';
const app = express();
const port = Number(process.env.PORT) || 10000;
app.listen(port, () => {
    console.log(`Server listening on ...${port}`);
});
//# sourceMappingURL=server.js.map
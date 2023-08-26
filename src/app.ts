import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

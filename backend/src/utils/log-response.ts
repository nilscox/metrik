import { Request } from 'supertest';

export const logResponse = (req: Request) => {
  req.on('response', (res) => console.log(res.body));
};

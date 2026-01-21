import { createExpressServer } from "routing-controllers";
import 'dotenv/config';

let PORT = 3002;

// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
  cors: {
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ["http://localhost:4210", "http://localhost:8080", "http://localhost:4201", "http://localhost:4200", "http://localhost"],
    credentials: true
  },
  routePrefix: "/bp", 

  controllers: [
    __dirname + "/controllers/*{.js,.ts}",
  ], // we specify controllers we want to use
});

// run express application on port 3002
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Iniciado`);
  console.log(`Host: http://0.0.0.0:${PORT}`);
  console.log(`Fecha/Hora: ${new Date().toLocaleString()}`);
});

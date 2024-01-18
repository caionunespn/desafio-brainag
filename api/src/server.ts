import { PORT } from "./config/environment";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerOptions from "./config/swagger";
import swaggerUI from "swagger-ui-express";
import ProducerRoutes from "./routes/producer.routes";
import DashboardRoutes from "./routes/dashboard.routes";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("API is working");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(ProducerRoutes);
app.use(DashboardRoutes);

const specs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});

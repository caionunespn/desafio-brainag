import swaggerOptions from "../../swagger.json";
import { PORT } from "./environment";

export default {
    failOnErrors: true,
    definition: {
        ...swaggerOptions,   
        servers: [{ "url": `http://localhost:${PORT}` }],
    },
    apis: ['./src/routes*.ts'],
}
import dotenv from "dotenv";

if (process.env.NODE_ENV === "DEVELOPMENT") {
    dotenv.config({
        path: ".env.development",
    });
} else if (process.env.NODE_ENV === "PRODUCTION") {
    dotenv.config();
}

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

export {
    PORT,
    DATABASE_URL,
}

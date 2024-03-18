import "reflect-metadata";
import cors from "cors";

import express, {NextFunction, Request, Response} from "express";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import {DataSource} from "typeorm";

import {configs} from "./configs/config";
import {ApiError} from "./errors";
import {apiRouter} from "./router/api.router";
import {apiService} from "./service/api.servce";
import {Positions, Token, User} from "./entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: "postgres://postgres:abz_base@db:5432/postgres",
    // host: "localhost",
    host: "db",
    port: 5432,
    username: "postgres",
    password: "abz_base",
    database: "postgres",
    entities: [User,Token,Positions],
    migrations: ["src/migration/**/*.js"],
    migrationsTableName: "migration_table",
    subscribers: [],
    logging: true,
    synchronize: true,
});

const app = express();
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
});

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: [
            "Authorization",
            "Content-Type",
            "Origin",
            "Access-Control-Allow-Origin",
        ],
        preflightContinue: false,
        optionsSuccessStatus: 200,
    })
);

app.use("*", apiLimiter);
app.use(express.json({limit: "500mb"}));
app.use(
    express.urlencoded({
        limit: "500mb",
        extended: false,
        parameterLimit: 500000,
    }),
);
app.use(express.urlencoded({extended: true}));
app.use(
    fileUpload({
        limits: {fileSize: 500 * 1024 * 1024}, // 500 MB
        useTempFiles: true,
        tempFileDir: "/tmp/",
    }),
);

app.use("/api/v1", apiRouter);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;

    return res.status(status).json({
        message: err.message,
        success: err.success,
        status: err.status,
        fails: err.fails,
    });
});

// DB_URL = mongodb://user:user@db:27017/dec-2022
//Функция для докера, которая ждет подключение к бд:
const dbConnect = async () => {
    let dbCon = false;

    while (!dbCon) {
        try {
            console.log('Connecting to database');
            await AppDataSource.initialize();
            dbCon = true
        } catch (e) {
            console.log('database unavaliable, wait 3 sec');
            await new Promise(resolve => setTimeout(resolve, 3000))
        }
    }
}

const start = async () => {
    try {
        await dbConnect()
        app.listen(configs.PORT, async () => {
            // await AppDataSource.initialize();
            await apiService.generateUsers(0);
            console.log(`Server has started on PORT ${configs.PORT} 🥸`);
        });
    } catch (e) {
        console.log(e)
    }
}

start()

import * as express from 'express';
import {Express, NextFunction, Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import IApplicationConfig from './core/IApplicationConfig'
import AppRoutes from './routes/AppRoutes';
import IMainApplicationConfig from "./core/IMainApplicationConfig";
import axios, {AxiosInstance} from 'axios';
// import * as bcrypt from 'bcrypt';

export default class App {
    private static app: App;
    private readonly expApp: Express;
    private token: string;
    readonly axiosInstance: AxiosInstance;

    public static getInstance(): App {
        return App.app;
    }

    constructor(private config: IApplicationConfig, private mainAppConfig: IMainApplicationConfig) {
        if (App.app instanceof App) {
            throw new Error('Нельзя создать более одного экземпляра приложения');
        }

        this.config = config;
        this.mainAppConfig = mainAppConfig;
        this.expApp = express();
        App.app = this;

        this.axiosInstance = axios.create({
            baseURL: `${this.mainAppConfig.host}:${this.mainAppConfig.port}/testing_server/`,
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
            }
        });
    }

    run(): void {
        this.expApp.use(bodyParser.urlencoded({extended: false}));

        this.expApp.use((req: Request, res: Response, next: NextFunction) => {
            res.contentType('application/json');
            next();
        });

        let appRouter = new AppRoutes();
        appRouter.mount(this.expApp);

        this.expApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            res.status(500).json(err.message);
        });

        this.setToken();

        this.expApp.listen(this.config.listenPort, (err) => {
            if (err !== undefined) {
                console.log(err);
            } else {
                // console.log('key: ' + bcrypt.hashSync(this.config.appKey, 10));
                console.log("Server run on port: " + this.config.listenPort);
            }
        });
    }

    getToken() {
        return this.token
    }

    private setToken() {
        this.axiosInstance({
            method: 'get',
            url: `/get_token_by_app_key?key=${this.config.appKey}`
        })
            .then((result: any) => {
                this.token = result.data;
                console.log(this.token);
            })
            .catch((e: Error) => {
                console.log(e.message)
            })
    }
}

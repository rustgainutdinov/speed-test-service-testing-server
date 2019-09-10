import * as express from 'express';
import * as bodyParser from 'body-parser';
import AppRoutes from './routes/AppRoutes';
import axios from 'axios';
export default class App {
    constructor(config, mainAppConfig) {
        this.config = config;
        this.mainAppConfig = mainAppConfig;
        this.readonly = expApp;
        this.readonly = axiosInstance;
        if (App.app instanceof App) {
            throw new Error('Нельзя создать более одного экземпляра приложения');
        }
        this.config = config;
        this.mainAppConfig = mainAppConfig;
        this.expApp = express();
        App.app = this;
        this.axiosInstance = axios.create({
            baseURL: `${this.mainAppConfig.host}:${this.mainAppConfig.port}/speed_test_service/`,
            timeout: 10000,
        });
    }
    static getInstance() {
        return App.app;
    }
    run() {
        this.expApp.use(bodyParser.urlencoded({ extended: false }));
        this.expApp.use((req, res, next) => {
            res.contentType('application/json');
            next();
        });
        let appRouter = new AppRoutes();
        appRouter.mount(this.expApp);
        this.expApp.use((err, req, res, next) => {
            res.status(500).json(err.message);
        });
        this.setToken();
        this.expApp.listen(this.config.listenPort, (err) => {
            if (err !== undefined) {
                console.log(err);
            }
            else {
                console.log("Server run on port: " + this.config.listenPort);
            }
        });
    }
    getToken() {
        return this.token;
    }
    setToken() {
        this.axiosInstance({
            method: 'post',
            url: `/get_token?key=${this.config.appKey}`
        })
            .then((result) => {
            this.token = result.data.token;
            console.log(this.token);
        })
            .catch((e) => {
            console.log(e.message);
        });
    }
}

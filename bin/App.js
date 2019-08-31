"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const AppRoutes_1 = require("./routes/AppRoutes");
const axios_1 = require("axios");
class App {
    constructor(config, mainAppConfig) {
        this.config = config;
        this.mainAppConfig = mainAppConfig;
        if (App.app instanceof App) {
            throw new Error('Нельзя создать более одного экземпляра приложения');
        }
        this.config = config;
        this.mainAppConfig = mainAppConfig;
        this.expApp = express();
        App.app = this;
        this.axiosInstance = axios_1.default.create({
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
        let appRouter = new AppRoutes_1.default();
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
exports.default = App;

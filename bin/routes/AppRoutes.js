"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PageSpeedTestRoute_1 = require("./PageSpeedTestRoute");
class AppRoutes {
    constructor() {
        this.routeList = [
            { path: '/test', router: PageSpeedTestRoute_1.default },
        ];
    }
    mount(expApp) {
        this.routeList.forEach((item) => {
            expApp.use(item.path, item.router.createRouter(express_1.Router));
        });
    }
}
exports.default = AppRoutes;

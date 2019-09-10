import { Router } from 'express';
import PageSpeedTestRoute from './PageSpeedTestRoute';
export default class AppRoutes {
    constructor() {
        this.routeList = [
            { path: '/test', router: PageSpeedTestRoute },
        ];
    }
    mount(expApp) {
        this.routeList.forEach((item) => {
            expApp.use(item.path, item.router.createRouter(Router));
        });
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
const MAIN_APP_CONFIG = {
    host: 'http://localhost',
    port: 8000
};
const APP_CONFIG = {
    listenPort: 3080,
    appName: 'Example Application',
    appKey: 'ce181ed8410745e98fd6c4979c58f4d0'
};
try {
    (new App_1.default(APP_CONFIG, MAIN_APP_CONFIG)).run();
}
catch (e) {
    console.error(e.message);
}

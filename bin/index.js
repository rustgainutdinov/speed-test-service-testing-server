"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
const mainAppConfig_1 = require("./config/mainAppConfig");
const appConig_1 = require("./config/appConig");
try {
    const app = new App_1.default(appConig_1.default, mainAppConfig_1.default);
    app.run();
}
catch (e) {
    console.error(e.message)    ;
}

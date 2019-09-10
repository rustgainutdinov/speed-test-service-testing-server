import App from './App';
import MAIN_APP_CONFIG from './config/mainAppConfig';
import APP_CONFIG from './config/appConig';
try {
    const app = new App(APP_CONFIG, MAIN_APP_CONFIG);
    app.run();
}
catch (e) {
    console.error(e.message);
}

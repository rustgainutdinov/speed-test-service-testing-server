import IApplicationConfig from './core/IApplicationConfig'
import IMainApplicationConfig from './core/IMainApplicationConfig'
import App from './App';

const MAIN_APP_CONFIG: IMainApplicationConfig = {
	host: 'http://localhost',
	port: 8000
};

const APP_CONFIG: IApplicationConfig = {
	listenPort: 3080,
	appName: 'Example Application',
	appKey: 'ce181ed8410745e98fd6c4979c58f4d0'
};

try {
	(new App(APP_CONFIG, MAIN_APP_CONFIG)).run();
} catch (e) {
	console.error(e.message);
}

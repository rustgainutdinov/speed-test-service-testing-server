import * as fs from "fs";
import App from "../App";
import auditsIndicators from '../config/AuditsIndicators'
import pageSpeedInsightsLink from '../config/pageSpeedInsightsLink'

const testsDataDirectoryPath = '../tests_data/';

const request = require('request-promise');

export default class PageSpeedTest {
	static checkUrlOnGoogleAnalytics(url: string, mobileMode: string, cb: Function) {
		const mode = mobileMode === 'mobile' ? 'mobile' : 'desktop';
		
		const options = {
			method: 'GET',
			json: true,
			encoding: null,
			uri: `${pageSpeedInsightsLink}url=http://www.${url}/&strategy=${mode}`
		};
		
		request(options)
			.then(function (results: any) {
				let result = {url, mode};
				auditsIndicators.forEach((item: string) => {
					console.log(item, item.replace(/-/gi, '_'));
					result[item.replace(/-/gi, '_')] = results.lighthouseResult.categories[item].score;
				});
				cb(result);
			})
			.catch(function (e: Error) {
				console.log(e);
			});
	}
	
	static checkListOfUrlsOnGoogleAnalytics(listOfUrls: any, idTest: string) {
		fs.writeFileSync(`${testsDataDirectoryPath + idTest}.json`, '[');
		for (let key in listOfUrls) {
			this.checkUrlOnGoogleAnalytics(listOfUrls[key].name, listOfUrls[key].mode, (result: any) => {
				fs.appendFileSync(`${testsDataDirectoryPath + idTest}.json`, JSON.stringify(result) + ',');
			})
		}
		
		
		setTimeout(() => {
			fs.appendFileSync(`${testsDataDirectoryPath + idTest}.json`, '{}]');
			const result: Buffer = fs.readFileSync(`${testsDataDirectoryPath + idTest}.json`);
			let resultArr: Array<object>;
			try {
				resultArr = result ? JSON.parse(result.toString()) : [{}];
			} catch (e) {
				console.log(e);
				return;
			}
			resultArr.pop();
			this.sendResultsOnMainServer(resultArr, idTest);
		}, 30000);
	}
	
	private static sendResultsOnMainServer(result: Array<object>, idTest: string) {
		const app: App = App.getInstance();
		app.axiosInstance({
				method: "post",
				url: `/add_data?token=${app.getToken()}&result=${JSON.stringify(result)}&id_test=${idTest}`
			}
		).then((result: any) => {
				console.log(result.data);
			})
			.catch((e: Error) => {
				console.log(e.message)
			})
	}
}

import * as fs from "fs";
import App from "../App";

const request = require('request-promise');

export default class PageSpeedTest {
	static checkUrlOnGoogleAnalytics(url: string, mobileMode: string, cb: Function) {
		const mode = mobileMode === 'mobile' ? 'mobile' : 'desktop';
		
		const options = {
			method: 'GET',
			json: true,
			encoding: null,
			uri: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?key=AIzaSyDd4qd5w_zXactAJvKBR5ixZXnOYDCE9oM&url=http://www.${url}/&strategy=${mode}`
		};
		
		request(options)
			.then(function (results: any) {
				const result = {
					url,
					mode,
					'perfomance': results.lighthouseResult.categories.performance.score,
					'first_contentful_paint': results.lighthouseResult.audits['first-contentful-paint'].score,
					'speed_index': results.lighthouseResult.audits['speed-index'].score,
					'interactive': results.lighthouseResult.audits['interactive'].score,
					'first_meaningful_paint': results.lighthouseResult.audits['first-meaningful-paint'].score,
					'first_cpu_idle': results.lighthouseResult.audits['first-cpu-idle'].score,
					'estimated_input_latency': results.lighthouseResult.audits['estimated-input-latency'].score,
					'uses_rel_preload': results.lighthouseResult.audits['uses-rel-preload'].score,
					'render_blocking_resources': results.lighthouseResult.audits['render-blocking-resources'].score,
					'unused_css_rules': results.lighthouseResult.audits['unused-css-rules'].score,
					// 'user-timings': results.lighthouseResult.audits['user-timings'].score,
					'mainthread_work_breakdown': results.lighthouseResult.audits['mainthread-work-breakdown'].score,
					'uses_long_cache_ttl': results.lighthouseResult.audits['uses-long-cache-ttl'].score,
					'dom_size': results.lighthouseResult.audits['dom-size'].score,
					'bootup_time': results.lighthouseResult.audits['bootup-time'].score,
					// 'critical-request-chains': results.lighthouseResult.audits['critical-request-chains'].score,
					'offscreen_images': results.lighthouseResult.audits['offscreen-images'].score,
					'unminified_css': results.lighthouseResult.audits['unminified-css'].score,
					'unminified_javascript': results.lighthouseResult.audits['unminified-javascript'].score,
					'uses_optimized_images': results.lighthouseResult.audits['uses-optimized-images'].score,
					'time_to_first_byte': results.lighthouseResult.audits['time-to-first-byte'].score,
					'redirects': results.lighthouseResult.audits['redirects'].score
				};
				cb(result);
			})
			.catch(function (e: Error) {
				console.log(e);
			});
	}
	
	static checkListOfUrlsOnGoogleAnalytics(listOfUrls: any, idTest: string) {
		fs.writeFileSync(`../tests_data/${idTest}.json`, '[');
		for (let key in listOfUrls) {
			this.checkUrlOnGoogleAnalytics(listOfUrls[key].name, listOfUrls[key].mode, (result: any) => {
				fs.appendFileSync(`../tests_data/${idTest}.json`, JSON.stringify(result) + ',');
			})
		}
		
		
		setTimeout(() => {
			fs.appendFileSync(`../tests_data/${idTest}.json`, '{}]');
			const result: Buffer = fs.readFileSync(`../tests_data/${idTest}.json`);
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
				url: `/speed_test_service/add_data?token=${app.getToken()}&result=${JSON.stringify(result)}&id_test=${idTest}`
			}
		).then((result: any) => {
				console.log(result.data);
			})
			.catch((e: Error) => {
				console.log(e.message)
			})
	}
}

import * as fs from "fs";
import App from "../App";
import auditsIndicators from '../config/AuditsIndicators'
import pageSpeedInsightsLink from '../config/pageSpeedInsightsLink'

const qs = require('query-string');

const FormData = require('form-data');
const testsDataDirectoryPath = '../tests_data/';
const requestPromise = require('request-promise');
const request = require('request');

export default class PageSpeedTest {
    static checkUrlOnGoogleAnalytics(url: string, mobileMode: string, cb: Function) {
        const mode = mobileMode === 'mobile' ? 'mobile' : 'desktop';

        const options = {
            method: 'GET',
            json: true,
            encoding: null,
            uri: `${pageSpeedInsightsLink}url=http://www.${url}&strategy=${mode}`
        };

        requestPromise(options)
            .then(function (results: any) {
                let result = {url, mode, performance: results.lighthouseResult.categories.performance.score};
                auditsIndicators.forEach((item: string) => {
                    result[item.replace(/-/gi, '_')] = results.lighthouseResult.audits[item].score;
                    if (results.lighthouseResult.audits[item].displayValue) {
                        result[item.replace(/-/gi, '_') + '_display_value'] = results.lighthouseResult.audits[item].displayValue;
                    }
                });
                cb(result);
            })
            .catch(function (e: Error) {
                console.log(e.message);
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
        app.axiosInstance.post('/save_testing_data', qs.stringify({result: JSON.stringify(result)}), {
            params: {
                id_test: idTest,
                token: app.getToken()
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then((result: any) => {
                console.log(result.data);
            })
            .catch((e: Error) => {
                console.log(e.message)
            })
    }
}

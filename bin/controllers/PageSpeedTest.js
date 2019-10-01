"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const App_1 = require("../App");
const AuditsIndicators_1 = require("../config/AuditsIndicators");
const pageSpeedInsightsLink_1 = require("../config/pageSpeedInsightsLink");
const qs = require('query-string');
const FormData = require('form-data');
const testsDataDirectoryPath = '../tests_data/';
const requestPromise = require('request-promise');
const request = require('request');
class PageSpeedTest {
    static checkUrlOnGoogleAnalytics(url, mobileMode, cb) {
        const mode = mobileMode === 'mobile' ? 'mobile' : 'desktop';
        const options = {
            method: 'GET',
            json: true,
            encoding: null,
            uri: `${pageSpeedInsightsLink_1.default}url=http://www.${url}&strategy=${mode}`
        };
        requestPromise(options)
            .then(function (results) {
            let result = { url, mode, performance: results.lighthouseResult.categories.performance.score };
            AuditsIndicators_1.default.forEach((item) => {
                result[item.replace(/-/gi, '_')] = results.lighthouseResult.audits[item].score;
                if (results.lighthouseResult.audits[item].displayValue) {
                    result[item.replace(/-/gi, '_') + '_display_value'] = results.lighthouseResult.audits[item].displayValue;
                }
            });
            cb(result);
        })
            .catch(function (e) {
            console.log(e.message);
        });
    }
    static checkListOfUrlsOnGoogleAnalytics(listOfUrls, idTest) {
        fs.writeFileSync(`${testsDataDirectoryPath + idTest}.json`, '[');
        for (let key in listOfUrls) {
            this.checkUrlOnGoogleAnalytics(listOfUrls[key].name, listOfUrls[key].mode, (result) => {
                fs.appendFileSync(`${testsDataDirectoryPath + idTest}.json`, JSON.stringify(result) + ',');
            });
        }
        setTimeout(() => {
            fs.appendFileSync(`${testsDataDirectoryPath + idTest}.json`, '{}]');
            const result = fs.readFileSync(`${testsDataDirectoryPath + idTest}.json`);
            let resultArr;
            try {
                resultArr = result ? JSON.parse(result.toString()) : [{}];
            }
            catch (e) {
                console.log(e);
                return;
            }
            resultArr.pop();
            this.sendResultsOnMainServer(resultArr, idTest);
        }, 30000);
    }
    static sendResultsOnMainServer(result, idTest) {
        const app = App_1.default.getInstance();
        app.axiosInstance.post('/save_testing_data', qs.stringify({ result: JSON.stringify(result) }), {
            params: {
                id_test: idTest,
                token: app.getToken()
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then((result) => {
            console.log(result.data);
        })
            .catch((e) => {
            console.log(e.message);
        });
    }
}
exports.default = PageSpeedTest;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const App_1 = require("../App");
const AuditsIndicators_1 = require("../config/AuditsIndicators");
const pageSpeedInsightsLink_1 = require("../config/pageSpeedInsightsLink");
const testsDataDirectoryPath = '../tests_data/';
const request = require('request-promise');
class PageSpeedTest {
    static checkUrlOnGoogleAnalytics(url, mobileMode, cb) {
        const mode = mobileMode === 'mobile' ? 'mobile' : 'desktop';
        const options = {
            method: 'GET',
            json: true,
            encoding: null,
            uri: `${pageSpeedInsightsLink_1.default}url=http://www.${url}&strategy=${mode}`
        };
        request(options)
            .then(function (results) {
            let result = { url, mode, performance: results.lighthouseResult.categories.performance.score };
            AuditsIndicators_1.default.forEach((item) => {
                result[item.replace(/-/gi, '_')] = results.lighthouseResult.audits[item].score;
            });
            cb(result);
        })
            .catch(function (e) {
            console.log(e);
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
        app.axiosInstance({
            method: "post",
            url: `/add_data?token=${app.getToken()}&result=${JSON.stringify(result)}&id_test=${idTest}`
        }).then((result) => {
            console.log(result.data);
        })
            .catch((e) => {
            console.log(e.message);
        });
    }
}
exports.default = PageSpeedTest;

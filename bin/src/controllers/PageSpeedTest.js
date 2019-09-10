import * as fs from "fs";
import App from "../App";
import auditsIndicators from '../config/AuditsIndicators';
import pageSpeedInsightsLink from '../config/pageSpeedInsightsLink';
const testsDataDirectoryPath = '../tests_data/';
const request = require('request-promise');
export default class PageSpeedTest {
    static checkUrlOnGoogleAnalytics(url, mobileMode, cb) {
        const mode = mobileMode === 'mobile' ? 'mobile' : 'desktop';
        const options = {
            method: 'GET',
            json: true,
            encoding: null,
            uri: `${pageSpeedInsightsLink}url=http://www.${url}&strategy=${mode}`
        };
        request(options)
            .then(function (results) {
            let result = { url, mode, performance: results.lighthouseResult.categories.performance.score };
            auditsIndicators.forEach((item) => {
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
        const app = App.getInstance();
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

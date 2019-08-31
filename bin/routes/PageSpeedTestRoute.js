"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../middleware/validate");
const PageSpeedTest_1 = require("../controllers/PageSpeedTest");
const PageSpeedTestRoute = {
    createRouter(router) {
        return router()
            .get('/url', (req, res, next) => {
            if (validate_1.checkRequired(req, 'query[url]', next) ||
                validate_1.checkRequired(req, 'query[mode]', next)) {
                return;
            }
            PageSpeedTest_1.default.checkUrlOnGoogleAnalytics(req.query.url, req.query.mode, (score) => {
                res.json(score);
            });
        }).get('/list_of_urls', (req, res, next) => {
            if (validate_1.checkRequired(req, 'query[list_of_urls]', next) ||
                validate_1.checkRequired(req, 'query[id_test]', next)) {
                return;
            }
            const listOfUrls = JSON.parse(req.query['list_of_urls']);
            if (typeof listOfUrls !== 'object') {
                return next(new Error('Undefined type of list of urls'));
            }
            PageSpeedTest_1.default.checkListOfUrlsOnGoogleAnalytics(listOfUrls, req.query['id_test']);
            res.json('Ok');
        });
    }
};
exports.default = PageSpeedTestRoute;

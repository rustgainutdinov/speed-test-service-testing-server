import { checkRequired } from "../middleware/validate";
import PageSpeedTest from '../controllers/PageSpeedTest';
const PageSpeedTestRoute = {
    createRouter(router) {
        return router()
            .get('/url', (req, res, next) => {
            if (checkRequired(req, 'query[url]', next) ||
                checkRequired(req, 'query[mode]', next)) {
                return;
            }
            PageSpeedTest.checkUrlOnGoogleAnalytics(req.query.url, req.query.mode, (score) => {
                res.json(score);
            });
        }).get('/list_of_urls', (req, res, next) => {
            if (checkRequired(req, 'query[list_of_urls]', next) ||
                checkRequired(req, 'query[id_test]', next)) {
                return;
            }
            const listOfUrls = JSON.parse(req.query['list_of_urls']);
            if (typeof listOfUrls !== 'object') {
                return next(new Error('Undefined type of list of urls'));
            }
            PageSpeedTest.checkListOfUrlsOnGoogleAnalytics(listOfUrls, req.query['id_test']);
            res.json('Ok');
        });
    }
};
export default PageSpeedTestRoute;

import {NextFunction, Request, Response} from 'express';
import {checkRequired} from "../middleware/validate";
import IApplicationRoute from '../core/IApplicationRoute';
import PageSpeedTest from '../controllers/PageSpeedTest'

//Page Speed Route
const PageSpeedTestRoute: IApplicationRoute = {
	createRouter(router) {
		return router()
			.get('/url', (req: Request, res: Response, next: NextFunction) => {
				checkRequired(req, 'query[url]', next);
				checkRequired(req, 'query[mode]', next);
				PageSpeedTest.checkUrlOnGoogleAnalytics(req.query.url, req.query.mode, (score: number) => {
					res.json(score);
				})
			}).get('/list_of_urls', (req: Request, res: Response, next: NextFunction) => {
				checkRequired(req, 'query[list_of_urls]', next);
				checkRequired(req, 'query[id_test]', next);
				const listOfUrls = JSON.parse(req.query['list_of_urls']);
				if (typeof listOfUrls !== 'object') {
					return next(new Error('Undefined type of list of urls'));
				}
				PageSpeedTest.checkListOfUrlsOnGoogleAnalytics(listOfUrls, req.query['id_test']);
				res.json('Ok');
			})
	}
};

export default PageSpeedTestRoute;

import {Express, Router} from 'express';

import IPathRoute from '../core/IPathRoute';
import PageSpeedTestRoute from './PageSpeedTestRoute'

export default class AppRoutes {
	private routeList: IPathRoute[] = [
		{path: '/test', router: PageSpeedTestRoute},
	];
	
	mount(expApp: Express): void {
		this.routeList.forEach((item) => {
			expApp.use(
				item.path,
				item.router.createRouter(Router)
			);
		});
	}
}

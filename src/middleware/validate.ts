import {NextFunction} from "express";

function checkRequired(req: any, param: string, next: NextFunction): boolean {
	let regular = param.match(/(.+)\[(.+?)\]/i);
	if (!regular) {
		next(new Error(`Param is required`));
		return true
	} else {
		const name: string = regular[1];
		const id: string = regular[2];
		if (!(req[name] && req[name][id])) {
			next(new Error(`Param ${name}[${id}] is required`));
			return true
		}
	}
	
	return false
}

export {checkRequired}

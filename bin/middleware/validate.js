"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkRequired(req, param, next) {
    let regular = param.match(/(.+)\[(.+?)\]/i);
    if (!regular) {
        next(new Error(`Param is required`));
        return true;
    }
    else {
        const name = regular[1];
        const id = regular[2];
        if (!(req[name] && req[name][id])) {
            next(new Error(`Param ${name}[${id}] is required`));
            return true;
        }
    }
    return false;
}
exports.checkRequired = checkRequired;

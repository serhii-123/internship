import { Context } from "hono";
import { MongoServerError } from "mongodb";
import _ from "lodash";
import Model from "./model";

class Controller {
    constructor(
        private model: Model
    ) {}

    public async postDoc(c: Context) {
        try {
            const body = await c.req.json().catch(() => null);
            const contentType = c.req.header('Content-Type');
            
            if(!body || ( contentType !== 'application/json' ))
                return c.body('Bad request', 400);

            if(_.isEmpty(body))
                return c.body('Request body cannot be empty', 400);

            await this.model.insertDoc(body);

            return c.body('OK');
        } catch(e) {
            console.log(e);
            if(e instanceof MongoServerError)
                if(e.code === 11000)
                    return c.body(`A document for the specified path already exists`, 409);
                else
                    return c.body('Server error', 500);
        }
    }

    public async getDoc(c: Context) {
        try {
            const path = c.req.param('path');
            const doc = await this.model.findDocByPath(path);
            
            return c.json(doc ? doc : {}, 200);
        } catch(e) {
            if(e instanceof MongoServerError)
                return c.body('Server error', 500);
        }
    }
}

export default Controller;
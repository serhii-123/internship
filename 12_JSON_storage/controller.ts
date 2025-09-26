import { Context } from "hono";
import { MongoServerError } from "mongodb";
import { isEmpty } from "lodash";
import Model from "./model";

class Controller {
    constructor(
        private model: Model
    ) {}

    public async postDoc(c: Context) {
        try {
            const body = await c.req.json().catch(() => null);
            const path = c.req.path;
            const contentType = c.req.header('Content-Type');
            
            if(!body || ( contentType !== 'application/json' ))
                return c.json({ message: 'No body provided or body is invalid' }, 400);

            if(isEmpty(body))
                return c.json({ message: 'Request body cannot be empty' }, 400);

            await this.model.insertDoc(path, body);

            return c.body('OK');
        } catch(e) {
            console.log(e);

            if(e instanceof MongoServerError)
                if(e.code === 11000)
                    return c.json({
                        message: `A document for the specified path already exists`
                    }, 409);
                else
                    return c.json({ message: 'Server error' }, 500);
        }
    }

    public async getDoc(c: Context) {
        try {
            const path = c.req.path;
            const doc = await this.model.findDocByPath(path);
            
            return c.json(doc ? doc : {}, 200);
        } catch(e) {
            return c.json({ message: 'Server error' }, 500);
        }
    }
}

export default Controller;
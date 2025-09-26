import z from 'zod';

const accessTokenSchema = z.string('No token provided').nonempty('No token provided');
const mePath = z.string().regex(/^\/me[0-9]$/, 'Not found');

export {
    accessTokenSchema,
    mePath
};
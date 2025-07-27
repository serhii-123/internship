import z from 'zod';

const accessTokenSchema = z.string().nonempty();

export {
    accessTokenSchema
};
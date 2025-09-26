import { ObjectId, OptionalId } from "mongodb";

type UserBody = {
    email: string,
    passwordHash: string
};

export type UserDb = UserBody & {
    _id: ObjectId,
};

export type UserOutput = UserBody & {
    id: string,
};

export type NewUserDb = OptionalId<UserDb>;
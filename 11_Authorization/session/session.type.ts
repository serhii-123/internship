import { ObjectId, OptionalId } from 'mongodb';

type SessionBody = {
    tokenHash: string,
    userId: string,
    createdAt: Date,
    expiresIn: Date,
    revoked: boolean
}
export type SessionDb = SessionBody & {
    _id: ObjectId,
};

export type NewSessionDb = OptionalId<SessionDb>;

export type SessionOutput = SessionBody & {
    id: string
}
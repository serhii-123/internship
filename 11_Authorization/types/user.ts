import { ObjectId } from "mongodb";

type NewUser = {
    email: string,
    passwordHash: string
}

type User = NewUser & {
    id: ObjectId
}

export { User, NewUser };
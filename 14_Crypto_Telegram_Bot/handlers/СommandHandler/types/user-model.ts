export type User = {
    id: number,
    tgUserId: number
}

export interface UserModel {
    getUserByTgUserId(userId: number): Promise<User | null>,
    insertUser(tgUserId: number): Promise<number>
}
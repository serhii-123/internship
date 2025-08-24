export type User = {
    id: number,
    userId: number
}

export interface UserModel {
    getUserByUserId(userId: number): Promise<User | null>,
    insertUser(userId: number): Promise<number>
}
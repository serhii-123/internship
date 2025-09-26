interface FollowingCurrencyModel {
    getCurrencyNamesByUserId(userId: number): Promise<{ name: string }[]>
    insertFollowingCurrency(currencyId: number, userId: number): Promise<number>
    deleteFollowingCurrencyByCurrencyUserIds(currencyId: number, userId: number): Promise<number>
}

export default FollowingCurrencyModel;
interface FollowingCurrencyModel {
    insertFollowingCurrency(currencyId: number, userId: number): Promise<number>
    deleteFollowingCurrencyByCurrencyUserIds(currencyId: number, userId: number): Promise<number>
}

export default FollowingCurrencyModel;
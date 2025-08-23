interface FollowingCurrencyModel {
    insertFollowingCurrency(currencyId: number, userId: number): Promise<void>
}

export default FollowingCurrencyModel;
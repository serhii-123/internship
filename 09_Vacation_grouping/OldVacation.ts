type OldVacation = {
    _id: string,
    user: {
        _id: string,
        name: string,
    },
    userDays: number,
    startDate: string,
    endDate: string
}

export default OldVacation;
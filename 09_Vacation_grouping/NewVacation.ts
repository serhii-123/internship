type NewVacation = {
    userId: string,
    name: string,
    weekendDates: WeekendDates[]
}

type WeekendDates = {
    startDate: string,
    endDate: string
}

export default NewVacation;
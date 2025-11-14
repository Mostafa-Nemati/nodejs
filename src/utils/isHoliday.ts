import dayjs from "dayjs"

export const isHoliday = (days: any) => {
    const today = dayjs();
    const todayShamsi = today.format("jYYYY-jMM-jDD");

    const holiday = days.include(todayShamsi) || today.day() === 5;
    return holiday;
}
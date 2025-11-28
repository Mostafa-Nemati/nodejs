import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday)

export const today = dayjs().calendar("jalali").format("YYYY-MM-DD"); 
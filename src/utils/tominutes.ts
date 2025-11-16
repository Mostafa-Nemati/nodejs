export function toMinutes(time: any) {
    const [h, m] = time ? time.split(":").map(Number) : [];
    return h * 60 + m;
}
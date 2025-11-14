export interface JwtUser {
    id: number;
    role: "ADMIN" | "USER";
    iat?: number;
    exp?: number;
}

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}
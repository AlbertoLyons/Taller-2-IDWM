export interface LogginDto{
    email: string,
    password: string
}
export interface Auth {
    id: number;
    name: string;
    email: string;
    roles: string[];
    token: string;
}
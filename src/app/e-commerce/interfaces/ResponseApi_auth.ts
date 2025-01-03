export interface LogginDto{
    email: string,
    password: string
}
export interface Auth {
    Id: number;
    Name: string;
    Email: string;
    Roles: string[];
    token: string;
}
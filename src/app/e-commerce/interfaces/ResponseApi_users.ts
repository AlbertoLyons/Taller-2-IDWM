export interface InfoUserDto {
    id:        number;
    rut:       string;
    birthdate: Date;
    mail:      string;
    name:      string;
    gender:    string;
}

export interface responseEdit {
    message: string;
    user:    boolean;
}
export interface updateProfile {
    birthdate: Date;
    name:      string;
    gender:    string;
}export interface updatePassword {
    actualPassword:  string;
    newPassword:     string;
    confirmPassword: string;
}
export interface ResponseGetAllUsers {
    message:      string;
    totalRecords: number;
    totalPages:   number;
    currentPage:  number;
    pageSize:     number;
    users:        InfoUserDto[];
}


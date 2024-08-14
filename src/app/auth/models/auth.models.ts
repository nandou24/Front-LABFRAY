export interface IUser {
    name: string;
    email: string;
    password: string;
    rol: number;
}

export interface IUserPostDTO {
  ok: boolean;
  msg?: string;
  errors?: string;
}
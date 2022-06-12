import { AccountModel } from "../models/account";

export interface AddAccontModel{
    name: string,
    email: string, 
    password: string
};


export interface AddAccount{
    add(account: AddAccontModel): Promise <AccountModel>;
};
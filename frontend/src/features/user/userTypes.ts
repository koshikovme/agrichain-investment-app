import {InvestmentsDto} from "../investment/investmentTypes";

export interface UserInfo {
    image: string | null;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    accountsDto: AccountsDto
    investments: InvestmentsDto[];
 }

 export interface UsersDto {
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    mobileNumber: string;
    accountsDto?: AccountsDto
}

 export interface UserState {
    userInfo: UserInfo;
    isLoading: boolean;
    error: string | null;
 }


 export interface AccountsDto {
    accountNumber: number;
    accountType: string;
 }

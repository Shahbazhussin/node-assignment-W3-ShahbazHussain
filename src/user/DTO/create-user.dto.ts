import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class createUserDTO{

    @IsNotEmpty()
    @IsString()
    name : string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email : string;

    @IsNotEmpty()
    @IsString()
    password : string;

}
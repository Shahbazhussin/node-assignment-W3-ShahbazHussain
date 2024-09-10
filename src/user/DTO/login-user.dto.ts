import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class userLoginDTO{

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email : string;

    @IsNotEmpty()
    @IsString()
    password : string;

}
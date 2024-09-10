import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class ProductDTO {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsUUID('4')
    @IsNotEmpty()
    categoryId : UUID;

}
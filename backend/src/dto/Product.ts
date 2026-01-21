import { IsDateString, IsNotEmpty, IsUrl, MaxLength, MinLength } from "class-validator";
import { ProductInterface } from "../interfaces/product.interface";

export class ProductDTO implements ProductInterface {
    @IsNotEmpty()
    id!: string;
    
    @MinLength(6)
    @MaxLength(100)
    name!: string;
    
    @MinLength(10)
    @MaxLength(200)
    description!: string;
    
    @IsNotEmpty()
    @IsUrl({ require_protocol: true }, { message: "El logo debe ser una URL válida con protocolo (http:// o https://)" })
    logo!: string;
    
    @IsDateString()
    date_release!: Date;
    
    @IsDateString()
    date_revision!: Date;
}
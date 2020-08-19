import { IsNumber, IsOptional, IsString } from "class-validator";

export class UserIdentifierDto {
    @IsOptional()
    @IsNumber()
    public id: number;

    @IsOptional()
    @IsString()
    public username: string;
}
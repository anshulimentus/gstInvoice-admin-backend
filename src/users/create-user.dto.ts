
import { IsNotEmpty, IsString, IsEmail, IsOptional, MinLength, Matches } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsOptional()
    @Matches(/^[a-z0-9]+$/, {
      message: 'Wallet address must be lowercase and alphanumeric only',
    })
    wallet_address?: string;

    @IsString()
    @IsOptional()
    role?: string;
}


export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password?: string;

    @IsString()
    @IsOptional()
    wallet_address?: string;

    @IsString()
    @IsOptional()
    role?: string;
}
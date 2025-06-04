import { Body, Controller, Post, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';   
import { BadRequestException } from '@nestjs/common/exceptions';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: { email: string; password: string }) {
        try {
            const { email, password } = loginDto;
            
            if (!email || !password) {
                throw new BadRequestException('Email and password are required');
            }

            const user = await this.authService.validateUser(email, password);
            if (!user) {
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
            }
            
            return this.authService.login(user);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('wallet-login')
    async walletLogin(@Body() body: { walletAddress: string; signature: string; nonce?: string }) {
        try {
            const { walletAddress, signature, nonce } = body;
            
            if (!walletAddress || !signature) {
                throw new BadRequestException('walletAddress and signature are required');
            }
            
            return await this.authService.walletLogin(walletAddress, signature, nonce);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Wallet login failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('request-nonce')
    async requestNonce(@Body() body: { walletAddress: string }) {
        try {
            if (!body.walletAddress) {
                throw new BadRequestException('walletAddress is required');
            }
            
            return await this.authService.requestNonce(body.walletAddress);
        } catch (error) {
            throw new HttpException('Failed to generate nonce', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req) {
        return this.authService.logout(req.user);
    }
}
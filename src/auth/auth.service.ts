import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ethers } from 'ethers';

@Injectable()
export class AuthService {
  private readonly nonces = new Map<string, string>();
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.log(`Validating user with email: ${email}`);
    const user = await this.usersService.findOneByEmail(email);
    
    if (user && await this.usersService.validatePassword(password, user.password)) {
      this.logger.log(`User validated successfully: ${email}`);
      const { password: _, ...result } = user;
      return result;
    }
    
    this.logger.warn(`User validation failed for email: ${email}`);
    return null;
  }

  async login(user: any) {
    this.logger.log(`Logging in user: ${user.email}`);
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      walletAddress: user.wallet_address 
    };
    const token = this.jwtService.sign(payload);
    this.logger.log(`Token generated for user: ${user.email}`);
    return {
      token,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        wallet_address: user.wallet_address,
        role: user.role
      }
    };
  }

  async logout(user: any) {
    this.logger.log(`Logging out user: ${user.email || user.walletAddress}`);
    return { message: 'Logged out successfully' };
  }

  async requestNonce(walletAddress: string) {
    const lowercase = walletAddress.toLowerCase();
    const nonce = Math.floor(Math.random() * 1000000).toString();
    this.nonces.set(lowercase, nonce);
    this.logger.log(`Nonce generated for wallet: ${walletAddress}, nonce: ${nonce}`);
    return { nonce };
  }

  async walletLogin(walletAddress: string, signature: string, nonce?: string): Promise<any> {
    const lowercaseAddress = walletAddress.toLowerCase();
    this.logger.log(`Wallet login attempt for address: ${walletAddress}`);

    // Get nonce from parameter or stored nonces
    let storedNonce = nonce;
    if (!storedNonce) {
      storedNonce = this.nonces.get(lowercaseAddress);
    }

    if (!storedNonce) {
      this.logger.warn(`Nonce not found for wallet: ${walletAddress}`);
      throw new UnauthorizedException('Nonce not found. Please request a new one.');
    }
    this.logger.log(`Nonce found for wallet: ${walletAddress}, nonce: ${storedNonce}`);

    // Verify signature
    let recoveredAddress: string;
    try {
      const message = `Sign this message to verify your identity: ${storedNonce}`;
      recoveredAddress = ethers.utils.verifyMessage(message, signature);
      this.logger.log(`Recovered address from signature: ${recoveredAddress}`);
    } catch (err) {
      this.logger.error(`Invalid signature for wallet: ${walletAddress}`, err.stack);
      throw new UnauthorizedException('Invalid signature.');
    }

    if (recoveredAddress.toLowerCase() !== lowercaseAddress) {
      this.logger.warn(`Signature verification failed for wallet: ${walletAddress}`);
      throw new UnauthorizedException('Signature verification failed');
    }

    // Check if user exists with this wallet address
    const user = await this.usersService.findOneByWalletAddress(lowercaseAddress);
    if (!user) {
      this.logger.warn(`No user found with wallet address: ${walletAddress}`);
      throw new UnauthorizedException('No user found with this wallet address. Please register first.');
    }

    // Clean up used nonce
    this.nonces.delete(lowercaseAddress);
    this.logger.log(`Nonce cleaned up for wallet: ${walletAddress}`);

    // Generate JWT token
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      walletAddress: user.wallet_address 
    };
    const token = this.jwtService.sign(payload);
    this.logger.log(`Token generated for wallet: ${walletAddress}, role: ${user.role}`);

    return {
      token,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        wallet_address: user.wallet_address,
        role: user.role
      }
    };
  }
}
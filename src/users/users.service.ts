import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto, UpdateUserDto } from './create-user.dto';

type SafeUser = Omit<User, 'password' | 'normalizeWalletAddress'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const { email, password, wallet_address, role = 'user' } = createUserDto;

    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (wallet_address) {
      const existingWallet = await this.findOneByWalletAddress(wallet_address);
      if (existingWallet) {
        throw new ConflictException('User with this wallet address already exists');
      }
    }

    const newUser = this.userRepository.create({
      email: email.toLowerCase(),
      password,
      wallet_address: wallet_address?.toLowerCase() ?? null,
      role: role.toLowerCase(),
    });

    const savedUser = await this.userRepository.save(newUser);
    const { password: _, normalizeWalletAddress, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findOneByWalletAddress(walletAddress: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { wallet_address: walletAddress.toLowerCase() },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.find();
    return users.map(({ password, normalizeWalletAddress, ...rest }) => rest);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<SafeUser> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: Partial<User> = {};

    if (updateUserDto.email) {
      const existingUser = await this.findOneByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already taken by another user');
      }
      updateData.email = updateUserDto.email.toLowerCase();
    }

    if (updateUserDto.password) {
      updateData.password = updateUserDto.password;
    }

    if (updateUserDto.wallet_address) {
      const existingWallet = await this.findOneByWalletAddress(updateUserDto.wallet_address);
      if (existingWallet && existingWallet.id !== id) {
        throw new ConflictException('Wallet address already taken by another user');
      }
      updateData.wallet_address = updateUserDto.wallet_address.toLowerCase();
    }

    if (updateUserDto.role) {
      updateData.role = updateUserDto.role.toLowerCase();
    }

    await this.userRepository.update(id, updateData);

    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    const { password, normalizeWalletAddress, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async validatePassword(plainPassword: string, storedPassword: string): Promise<boolean> {
    return plainPassword === storedPassword;
  }
}

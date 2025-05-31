import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
// import { Roles } from 'src/auth/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: User): Promise<User> {
    const { password, ...userData } = createUserDto;
    // Hash the plain-text password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with hashed password
    const newUser = { ...userData, password: hashedPassword };

    return await this.userRepository.save(newUser);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // Optional: Create user method
  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  } 
}

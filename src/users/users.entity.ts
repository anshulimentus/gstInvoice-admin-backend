import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  wallet_address: string | null;
  
  @BeforeInsert()
  @BeforeUpdate()
  normalizeWalletAddress() {
    if (this.wallet_address) {
      this.wallet_address = this.wallet_address.toLowerCase();
    }
  }

  @Column({ default: 'admin' })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
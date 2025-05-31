import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('gst_master')
export class GstMaster {
  @PrimaryColumn({ name: 'gst_number', type: 'varchar', length: 20 })
  gstNumber: string;

  @Column({ name: 'company_name', type: 'varchar', length: 100, nullable: true })
  companyName: string;

  @Column({ name: 'addressline1', type: 'varchar', length: 255, nullable: true })
  addressLine1: string;

  @Column({ name: 'addressline2', type: 'varchar', length: 255, nullable: true })
  addressLine2: string;

  @Column({ name: 'city', type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ name: 'state', type: 'int', nullable: true })
  state: number;

  @Column({ name: 'first_name', type: 'varchar', length: 50, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 50, nullable: true })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
  email: string;
}

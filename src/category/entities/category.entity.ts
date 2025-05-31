import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'companybusinesstype'})
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name : string;
}
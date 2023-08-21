import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: 'goal' })
export class Goal {
    @PrimaryGeneratedColumn('increment')
    public id?: number;

    @Column('varchar', { length: 64 })
    public userId: string;

    @Column('text')
    public goal: string;

    @CreateDateColumn()
    public createdAt?: string;
}

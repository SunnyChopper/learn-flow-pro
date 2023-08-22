import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: 'recommendation' })
export class Recommendation {
    @PrimaryGeneratedColumn('increment')
    public id?: number;

    @Column('varchar', { length: 64 })
    public userId: string;

    @Column('varchar', { length: 64 })
    public recommendationType: string;

    @Column('text')
    public recommendation: string;

    @Column('text')
    public articleHash: string;

    @CreateDateColumn()
    public createdAt?: string;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: 'learning_session' })
export class LearningSession {
    @PrimaryGeneratedColumn('increment')
    public id?: number;

    @Column('varchar', { length: 64 })
    public userId: string;

    @Column('int')
    public year: number;

    @Column('int')
    public month: number;

    @Column('int')
    public day: number;

    @Column('varchar', { length: 255 })
    public title: string;

    @Column('text', { nullable: true })
    public summary?: string;

    @CreateDateColumn()
    public createdAt?: string;
}

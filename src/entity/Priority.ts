import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: 'priority' })
export class Priority {
    @PrimaryGeneratedColumn('increment')
    public id?: number;

    @Column('int')
    public articleId: number;

    @Column('int')
    public sessionId: number;

    @Column('int')
    public priority: number;

    @CreateDateColumn()
    public createdAt?: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: 'article' })
export class Article {
    @PrimaryGeneratedColumn('increment')
    public id?: number;

    @Column('varchar', { length: 64 })
    public userId: string;

    @Column('int')
    public sessionId: number;

    @Column('varchar', { length: 255 })
    public title: string;

    @Column('varchar', { length: 255 })
    public url: string;

    @Column('text', { nullable: true })
    public summary?: string;

    @Column('varchar', { length: 64, nullable: true })
    public authors?: string;

    @CreateDateColumn()
    public createdAt?: string;
}

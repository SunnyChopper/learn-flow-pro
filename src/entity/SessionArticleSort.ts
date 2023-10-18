import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: 'session_article_sort' })
export class SessionArticleSort {
    @PrimaryGeneratedColumn('increment')
    public id?: number;

    @Column('int')
    public sessionId: number;

    @Column('int')
    public articleId: number;

    @Column('int')
    public sort: number;

    @Column('text')
    public reason: string;

    @Column('text')
    public informationFlow: string;

    @CreateDateColumn()
    public createdAt?: Date;
}

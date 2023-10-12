import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: 'article_cache' })
export class ArticleCache {
    @PrimaryGeneratedColumn('increment')
    public id?: number;

    @Column('int')
    public articleId: number;

    @Column('varchar', { length: 32 })
    public articleMediumId: string;

    @Column('text', { nullable: true })
    public markdown: string;

    @Column('text', { nullable: true })
    public summary?: string;

    @CreateDateColumn()
    public createdAt?: string;
}

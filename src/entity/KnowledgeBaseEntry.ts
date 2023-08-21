import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: 'knowledge_base_entry' })
export class KnowledgeBaseEntry {
    @PrimaryGeneratedColumn('increment')
    public id?: number;

    @Column('int')
    public knowledgeBaseId: number;

    @Column('int')
    public articleId: number;

    @CreateDateColumn()
    public createdAt?: Date;
}

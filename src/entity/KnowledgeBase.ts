import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: 'knowledge_base' })
export class KnowledgeBase {
    @PrimaryGeneratedColumn('increment')
    public id?: number;

    @Column('varchar', { length: 64 })
    public userId: string;

    @Column('varchar', { length: 128 })
    public title: string;

    @Column('text', { nullable: true })
    public description?: string;

    @CreateDateColumn()
    public createdAt?: Date;
}

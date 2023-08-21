import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: 'note' })
export class Note {
    @PrimaryGeneratedColumn('increment')
    public id?: number;

    @Column('int')
    public articleId: number;

    @Column('text')
    public note: string;

    @CreateDateColumn()
    public createdAt?: Date;
}

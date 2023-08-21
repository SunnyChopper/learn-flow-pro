import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: 'session_tag' })
export class SessionTag {
    @PrimaryGeneratedColumn('increment')
    public id?: number;

    @Column('int')
    public sessionId: string;

    @Column('varchar', { length: 255 })
    public title: string;

    @CreateDateColumn()
    public createdAt?: Date;
}

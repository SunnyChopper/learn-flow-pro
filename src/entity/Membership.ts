import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'membership' })
export class Membership {
    @PrimaryGeneratedColumn('increment')
    public id?: number;

    @Column('varchar', { length: 64 })
    public userId: string;

    @Column('varchar', { length: 64, nullable: true })
    public stripeCustomerId?: string;

    @Column('varchar', { length: 64, nullable: true })
    public stripeSubscriptionId?: string;

    @Column('date', { nullable: true })
    public currentPeriodEndDate?: string;

    @Column('date', { nullable: true })
    public lastPaymentDate?: string;

    @Column('int', { nullable: true })
    public failedPaymentAttempts?: number;

    @Column('varchar', { length: 64, nullable: true })
    public membershipLevel?: string;

    @Column('date', { nullable: true })
    public trialEndDate?: string;

    @Column('boolean', { default: false })
    public isTrial?: boolean;

    @Column('varchar', { length: 64, nullable: true })
    public offerCode?: string;

    @Column('date', { nullable: true })
    public offerEndDate?: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}

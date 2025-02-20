import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm"
import { Customer } from "./Customer"

export enum EventType {
    PURCHASE = 'purchase',
    RETURN = 'return',
    VISIT = 'visit',
    DATA_QUERY = 'data_query',
    DATA_UPDATE = 'data_update',
    INVOICE_DOWNLOAD = 'invoice_download'
}

@Entity("customer_events")
export class CustomerEvent {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Index()
    @ManyToOne(() => Customer, customer => customer.events)
    @JoinColumn({ name: "customerId" })
    customer: Customer

    @Index()
    @Column({
        type: "enum",
        enum: EventType,
    })
    eventType: EventType

    @Column("jsonb", { nullable: true })
    eventData: Record<string, any>

    @Index()
    @CreateDateColumn()
    createdAt: Date

    @Column({ nullable: true })
    description: string
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, OneToMany } from "typeorm"
import { CustomerEvent } from "./CustomerEvent"
import { Transaction } from "./Transaction"

@Entity("customers")
export class Customer {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Index()
    @Column()
    documentId: string

    @Column()
    documentType: string

    @CreateDateColumn()
    createdAt: Date

    @OneToMany(() => CustomerEvent, event => event.customer)
    events: CustomerEvent[]

    @OneToMany(() => Transaction, transaction => transaction.customer)
    transactions: Transaction[]
}
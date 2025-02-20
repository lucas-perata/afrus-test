import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index, OneToMany } from "typeorm"
import { Customer } from "./Customer"
import { Product } from "./Product"

@Entity("transactions")
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Index()
    @ManyToOne(() => Customer, customer => customer.transactions)
    @JoinColumn({ name: "customerId" })
    customer: Customer

    @Index()
    @ManyToOne(() => Product, product => product.transactions)
    @JoinColumn({ name: "productId" })
    product: Product

    @Column("decimal", { precision: 10, scale: 2 })
    paidPrice: number

    @Column("decimal", { precision: 10, scale: 2 })
    tax: number

    @Index()
    @CreateDateColumn()
    transactionDate: Date

    @Column("uuid")
    relatedEventId: string
}

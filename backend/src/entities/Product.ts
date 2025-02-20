import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany, DeleteDateColumn } from "typeorm"
import { Transaction } from "./Transaction"

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Index()
    @Column()
    name: string

    @Column("text")
    description: string

    @Index()
    @Column("decimal", { precision: 10, scale: 2 })
    price: number

    @Index()
    @Column()
    stockQuantity: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @OneToMany(() => Transaction, transaction => transaction.product)
    transactions: Transaction[]
}
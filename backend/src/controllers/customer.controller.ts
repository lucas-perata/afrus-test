import { Request, Response } from "express"
import { AppDataSource } from "../config/database"
import { Customer } from "../entities/Customer"
import { Transaction } from "../entities/Transaction"
import { CustomerTransactionDTO } from "../types"

const customerRepository = AppDataSource.getRepository(Customer)
const transactionRepository = AppDataSource.getRepository(Transaction)

export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await customerRepository.find({
      relations: ["transactions"]
    })
    return res.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return res.status(500).json({ message: "Error fetching customers" })
  }
}

export const getCustomerTransactions = async (_req: Request, res: Response) => {
  try {
    const transactions = await transactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.customer", "customer")
      .select([
        "customer.firstName ",
        "customer.lastName ",
        "customer.id ",
        "customer.documentId ",
        "transaction.id as transactionId",
        "transaction.paidPrice ",
        "transaction.transactionDate ",
        "transaction.relatedEventId "
      ])
      .getRawMany<CustomerTransactionDTO>()

    return res.json(transactions)
  } catch (error) {
    console.error("Error fetching customer transactions:", error)
    return res.status(500).json({ message: "Error fetching customer transactions" })
  }
}

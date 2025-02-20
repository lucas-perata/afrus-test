import { getCustomers, getCustomerTransactions } from "../controllers/customer.controller"
import { Router } from "express"


const router = Router()

router.get("/", getCustomers)
router.get("/transactions", getCustomerTransactions)

export default router
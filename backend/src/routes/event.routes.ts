import { createCustomerEvent, getCustomerEvents } from "../controllers/event.controller"
import { Router } from "express"


const router = Router()

router.post("/", createCustomerEvent)
router.get("/customer/:customerId", getCustomerEvents)

export default router
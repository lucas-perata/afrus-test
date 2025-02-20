import { Request, Response } from "express"
import { AppDataSource } from "../config/database"
import { CustomerEvent, EventType } from "../entities/CustomerEvent"
import { Customer } from "../entities/Customer"
import { TypedRequest, CreateCustomerEventDTO } from "../types"

const eventRepository = AppDataSource.getRepository(CustomerEvent)
const customerRepository = AppDataSource.getRepository(Customer)

export const createCustomerEvent = async (
    req: TypedRequest<CreateCustomerEventDTO>,
    res: Response
) => {
    try {
        const { customerId, eventType, eventData, description } = req.body

        if (!customerId || !eventType) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        if (!Object.values(EventType).includes(eventType as EventType)) {
            return res.status(400).json({ message: "Invalid event type" })
        }

        const customer = await customerRepository.findOneBy({ id: customerId })
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" })
        }

        const event = eventRepository.create({
            customer,
            eventType: eventType as EventType,
            eventData,
            description
        })

        await eventRepository.save(event)
        return res.status(201).json(event)
    } catch (error) {
        console.error("Error creating customer event:", error)
        return res.status(500).json({ message: "Error creating customer event" })
    }
}

interface CustomerEventParams {
    customerId: string;
}

export const getCustomerEvents = async (
    req: Request<CustomerEventParams>,
    res: Response
) => {
    try {
        const { customerId } = req.params;

        if (!customerId) {
            return res.status(400).json({ message: "Customer ID is required" });
        }

        const customer = await customerRepository.findOneBy({ id: customerId });

        if(!customer) {
            return res.status(404).json({message:"Customer not found"});
        }


        const events = await eventRepository.find({
            where: {
                customer: { id: customerId }
            },
            order: {
                createdAt: "DESC"
            }
        });

        return res.json(events);
    } catch (error) {
        console.error("Error fetching customer events:", error);
        return res.status(500).json({ message: "Error fetching customer events" });
    }
}
import { Request, Response } from "express"

export interface TypedRequest<T = any> extends Request {
    body: T
}

export interface TypedResponse<T = any> extends Response {
    json: (body: T) => this
}

export interface CreateProductDTO {
    name: string
    description: string
    price: number
    stockQuantity: number
}

export interface CreateCustomerEventDTO {
    customerId: string
    eventType: string
    eventData?: Record<string, any>
    description?: string
}

export interface CustomerTransactionDTO {
    userName: string
    userLastName: string
    userId: string
    userDocument: string
    transactionNumber: string
    transactionValue: number
    transactionDate: Date
    eventId: string
}
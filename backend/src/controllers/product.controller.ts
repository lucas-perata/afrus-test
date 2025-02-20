import { Request, Response } from "express"
import { AppDataSource } from "../config/database"
import { Product } from "../entities/Product"
import { TypedRequest, CreateProductDTO } from "../types"

const productRepository = AppDataSource.getRepository(Product)

export const getAllProducts = async (_req: Request, res: Response) => {
    try {
        const products = await productRepository.find({
            where: {
                deletedAt: null
            }
        })
        return res.json(products)
    } catch (error) {
        console.error("Error fetching products:", error)
        return res.status(500).json({ message: "Error fetching products" })
    }
}

export const createProduct = async (req: TypedRequest<CreateProductDTO>, res: Response) => {
    try {
        const { name, description, price, stockQuantity } = req.body

        if (!name || !description || !price || stockQuantity === undefined) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const product = productRepository.create({
            name,
            description,
            price,
            stockQuantity
        })

        await productRepository.save(product)
        return res.status(201).json(product)
    } catch (error) {
        console.error("Error creating product:", error)
        return res.status(500).json({ message: "Error creating product" })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const product = await productRepository.findOne({
            where: { id, deletedAt: null }
        })

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        await productRepository.softRemove(product)
        return res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
        console.error("Error deleting product:", error)
        return res.status(500).json({ message: "Error deleting product" })
    }
}

export const getProductsByPriceAndStock = async (_req: Request, res: Response) => {
    try {
        const products = await productRepository
            .createQueryBuilder("product")
            .where("product.price > :price", { price: 50 })
            .andWhere("product.stockQuantity < :stock", { stock: 20 })
            .andWhere("product.deletedAt IS NULL")
            .getMany()

        return res.json(products)
    } catch (error) {
        console.error("Error fetching filtered products:", error)
        return res.status(500).json({ message: "Error fetching filtered products" })
    }
}
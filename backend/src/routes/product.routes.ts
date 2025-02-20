import { Router } from "express"
import { 
    getAllProducts,
    createProduct,
    deleteProduct,
    getProductsByPriceAndStock
} from "../controllers/product.controller"

const router = Router()

router.get("/", getAllProducts)
router.post("/", createProduct)
router.delete("/:id", deleteProduct)
router.get("/filter/price-stock", getProductsByPriceAndStock)

export default router
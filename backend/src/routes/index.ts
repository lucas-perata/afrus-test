import { Router } from 'express';
import productRoutes from './product.routes';
import customerRoutes from './customer.routes';
import eventRoutes from './event.routes';
import reportRoutes from './report.routes';

const router = Router();

router.use("/products", productRoutes);
router.use("/customers", customerRoutes);
router.use("/events", eventRoutes);
router.use("/reports", reportRoutes);

export default router;
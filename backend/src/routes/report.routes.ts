import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';

const router = Router();
const reportController = new ReportController();

router.get("/filtered-products", reportController.getFilteredProducts);
router.get("/transactions", reportController.getTransactionReport);

export default router;
// src/scripts/generateReports.ts
import { ReportService } from '../services/reportService';

async function main() {
    console.log('🚀 Starting report generation process...');
    
    const reportService = new ReportService();
    
    try {
        await reportService.generateReports();
        console.log('✅ Report generation completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during report generation:', error.message);
        process.exit(1);
    }
}

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled rejection:', error);
    process.exit(1);
});

main().catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
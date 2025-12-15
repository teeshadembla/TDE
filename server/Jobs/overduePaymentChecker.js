import cron from 'node-cron';
import emailIntegration from '../utils/email/emailIntegration.js';

class OverduePaymentChecker {

  start() {
    console.log('\n🕐 Starting overdue payment checker...');
    console.log('   Will run daily at 2:00 AM\n');

    // Run every day at 2:00 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('\n⏰ Running overdue payment check...');
      console.log(`   Time: ${new Date().toLocaleString()}`);

      try {
        const result = await emailIntegration.processOverduePayments();
        
        if (result.success) {
          console.log(`   ✅ Processed ${result.processedCount} overdue payments\n`);
        } else {
          console.error('   ❌ Error processing overdue payments:', result.error);
        }
      } catch (error) {
        console.error('   ❌ Unexpected error in overdue payment checker:', error);
      }
    });

    console.log('   Running initial check now...');
    emailIntegration.processOverduePayments()
      .then(result => {
        if (result.success) {
          console.log(`   ✅ Initial check complete: ${result.processedCount} overdue payments\n`);
        }
      })
      .catch(error => {
        console.error('   ❌ Initial check failed:', error);
      });
  }

  
  async runManualCheck() {
    console.log('\n🔍 Running manual overdue payment check...');
    return await emailIntegration.processOverduePayments();
  }
}

export default new OverduePaymentChecker();
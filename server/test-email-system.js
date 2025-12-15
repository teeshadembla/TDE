import dotenv from 'dotenv';
const dotenvResult = dotenv.config(); // ⚠️ MUST be first - before all other imports

console.log('\n📁 Dotenv Config Result:');
console.log('Error:', dotenvResult.error ? dotenvResult.error.message : 'None');
console.log('Parsed:', Object.keys(dotenvResult.parsed || {}).length, 'variables');
console.log('BREVO_API_KEY loaded:', !!process.env.BREVO_API_KEY);
console.log('BREVO_TEMPLATE_WELCOME:', process.env.BREVO_TEMPLATE_WELCOME);
console.log('');

import mongoose from 'mongoose';
import readline from 'readline';

// Dynamic imports - these run AFTER dotenv.config()
const emailService = (await import('./Services/emailService.js')).default;
const emailScheduler = (await import('./utils/email/emailScheduler.js')).default;
const emailIntegration = (await import('./utils/email/emailIntegration.js')).default;
const userModel = (await import('./Models/userModel.js')).default;
const fellowshipModel = (await import('./Models/fellowshipModel.js')).default;
const fellowshipRegistrationModel = (await import('./Models/fellowshipRegistrationModel.js')).default;
const ScheduledEmail = (await import('./Models/scheduledEmailModel.js')).default;
const EmailLog = (await import('./Models/emailLogModel.js')).default;

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.a7cnmoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to database
await mongoose.connect(MONGO_URL);
console.log('✅ Connected to MongoDB\n');

// Test menu
const testMenu = `
========================================
EMAIL SYSTEM TEST MENU
========================================

1. Test Welcome Email
2. Test Registration Acceptance Email
3. Test Payment Reminder (Day 3)
4. Test Payment Reminder (Day 6)
5. Test Payment Confirmation Email
6. Test Registration Cancellation Email
7. View Scheduled Emails
8. View Email Logs
9. Test Full Registration Flow
10. Check Email Scheduler Stats
0. Exit

========================================
`;

async function getTestUser() {
  // Get first user from database for testing
  const user = await userModel.findOne({email: "teesha@thedigitaleconomist.com"});
  if (!user) {
    console.log('❌ No users found in database. Please create a user first.');
    process.exit(1);
  }
  return user;
}

async function getTestFellowship() {
  // Get first fellowship from database for testing
  const fellowship = await fellowshipModel.findOne();
  if (!fellowship) {
    console.log('❌ No fellowships found in database. Please create a fellowship first.');
    process.exit(1);
  }
  return fellowship;
}

async function createTestRegistration(user, fellowship) {
  // Create a test registration if none exists
  let registration = await fellowshipRegistrationModel.findOne({
    user: user._id,
    fellowship: fellowship._id
  });

  if (!registration) {
    registration = new fellowshipRegistrationModel({
      user: user._id,
      fellowship: fellowship._id,
      status: 'APPROVED',
      paymentStatus: 'PENDING',
      userStat: 'Fellow',
      workgroupId: fellowship.workGroupId,
      experience: '3-5',
      motivation: 'Test motivation',
      organization: 'Test Org',
      position: 'Test Position',
      amount: 4000,
      paymentDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await registration.save();
    console.log('✅ Created test registration');
  }

  return registration;
}

// Test functions
async function testWelcomeEmail() {
  console.log('\n📧 Testing Welcome Email...\n');
  const user = await getTestUser();
  
  const result = await emailService.sendWelcomeEmail(user);
  
  if (result.success) {
    console.log('✅ Welcome email sent successfully!');
    console.log(`   Email Log ID: ${result.emailLogId}`);
    console.log(`   SES Message ID: ${result.messageId}`);
  } else {
    console.log('❌ Failed to send welcome email');
    console.error('   Error:', result.error);
  }
}

async function testRegistrationAcceptanceEmail() {
  console.log('\n📧 Testing Registration Acceptance Email...\n');
  const user = await getTestUser();
  const fellowship = await getTestFellowship();
  const registration = await createTestRegistration(user, fellowship);

  const result = await emailService.sendRegistrationAcceptedEmail(
    registration,
    user,
    fellowship
  );
  
  if (result.success) {
    console.log('✅ Registration acceptance email sent successfully!');
    console.log(`   Email Log ID: ${result.emailLogId}`);
  } else {
    console.log('❌ Failed to send registration acceptance email');
    console.error('   Error:', result.error);
  }
}

async function testPaymentReminderDay3() {
  console.log('\n📧 Testing Payment Reminder (Day 3)...\n');
  const user = await getTestUser();
  const fellowship = await getTestFellowship();
  const registration = await createTestRegistration(user, fellowship);

  const result = await emailService.sendPaymentReminder(
    registration,
    user,
    fellowship,
    3
  );
  
  if (result.success) {
    console.log('✅ Day 3 reminder sent successfully!');
  } else {
    console.log('❌ Failed to send Day 3 reminder');
    console.error('   Error:', result.error);
  }
}

async function testPaymentReminderDay6() {
  console.log('\n📧 Testing Payment Reminder (Day 6)...\n');
  const user = await getTestUser();
  const fellowship = await getTestFellowship();
  const registration = await createTestRegistration(user, fellowship);

  const result = await emailService.sendPaymentReminder(
    registration,
    user,
    fellowship,
    6
  );
  
  if (result.success) {
    console.log('✅ Day 6 reminder sent successfully!');
  } else {
    console.log('❌ Failed to send Day 6 reminder');
    console.error('   Error:', result.error);
  }
}

async function testPaymentConfirmationEmail() {
  console.log('\n📧 Testing Payment Confirmation Email...\n');
  const user = await getTestUser();
  const fellowship = await getTestFellowship();
  const registration = await createTestRegistration(user, fellowship);

  const result = await emailService.sendPaymentConfirmedEmail(
    registration,
    user,
    fellowship,
    {
      transactionId: 'TEST_TXN_' + Date.now(),
      amount: registration.amount
    }
  );
  
  if (result.success) {
    console.log('✅ Payment confirmation email sent successfully!');
  } else {
    console.log('❌ Failed to send payment confirmation email');
    console.error('   Error:', result.error);
  }
}

async function testRegistrationCancellationEmail() {
  console.log('\n📧 Testing Registration Cancellation Email...\n');
  const user = await getTestUser();
  const fellowship = await getTestFellowship();
  const registration = await createTestRegistration(user, fellowship);

  const result = await emailService.sendRegistrationCancelledEmail(
    registration,
    user,
    fellowship
  );
  
  if (result.success) {
    console.log('✅ Cancellation email sent successfully!');
  } else {
    console.log('❌ Failed to send cancellation email');
    console.error('   Error:', result.error);
  }
}

async function viewScheduledEmails() {
  console.log('\n📅 Viewing Scheduled Emails...\n');
  
  const scheduled = await ScheduledEmail.find()
    .populate('user', 'FullName email')
    .sort({ scheduledFor: 1 })
    .limit(10);

  if (scheduled.length === 0) {
    console.log('   No scheduled emails found');
  } else {
    console.log(`   Found ${scheduled.length} scheduled emails:\n`);
    scheduled.forEach((email, index) => {
      console.log(`   ${index + 1}. ${email.emailType}`);
      console.log(`      To: ${email.user?.FullName} (${email.email})`);
      console.log(`      Scheduled: ${email.scheduledFor.toLocaleString()}`);
      console.log(`      Status: ${email.status}`);
      console.log('');
    });
  }
}

async function viewEmailLogs() {
  console.log('\n📊 Viewing Email Logs...\n');
  
  const logs = await EmailLog.find()
    .populate('user', 'FullName email')
    .sort({ createdAt: -1 })
    .limit(10);

  if (logs.length === 0) {
    console.log('   No email logs found');
  } else {
    console.log(`   Found ${logs.length} recent emails:\n`);
    logs.forEach((log, index) => {
      console.log(`   ${index + 1}. ${log.emailType}`);
      console.log(`      To: ${log.user?.FullName} (${log.email})`);
      console.log(`      Status: ${log.status}`);
      console.log(`      Sent: ${log.sentAt?.toLocaleString() || 'Not sent yet'}`);
      if (log.error) {
        console.log(`      Error: ${log.error.message}`);
      }
      console.log('');
    });
  }
}

async function testFullRegistrationFlow() {
  console.log('\n🔄 Testing Full Registration Flow...\n');
  console.log('This will:');
  console.log('1. Send acceptance email');
  console.log('2. Schedule payment reminders');
  console.log('3. Show scheduled emails\n');

  const user = await getTestUser();
  const fellowship = await getTestFellowship();
  const registration = await createTestRegistration(user, fellowship);

  console.log('📧 Step 1: Sending acceptance email and scheduling reminders...\n');
  
  const result = await emailIntegration.handleRegistrationApproval(
    registration,
    user,
    fellowship
  );

  if (result.success) {
    console.log('✅ Registration approval handled successfully!');
    console.log(`   Acceptance email sent: ${result.emailSent ? 'Yes' : 'No'}`);
    console.log(`   Reminders scheduled: ${result.remindersScheduled ? 'Yes' : 'No'}`);
    
    console.log('\n📅 Scheduled reminders:');
    const reminders = await ScheduledEmail.find({
      fellowshipRegistration: registration._id,
      status: 'PENDING'
    }).sort({ scheduledFor: 1 });

    reminders.forEach((reminder, index) => {
      console.log(`   ${index + 1}. ${reminder.emailType}`);
      console.log(`      Scheduled for: ${reminder.scheduledFor.toLocaleString()}`);
    });
  } else {
    console.log('❌ Failed to handle registration approval');
    console.error('   Error:', result.error);
  }
}

async function checkSchedulerStats() {
  console.log('\n📊 Email Scheduler Statistics...\n');
  
  const stats = await emailScheduler.getSchedulerStats();
  
  if (stats.success) {
    console.log('Status breakdown:');
    stats.stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });
    console.log(`\n   Ready to send now: ${stats.readyToSend}`);
  } else {
    console.log('❌ Failed to get stats');
  }
}

// Main test loop
async function runTests() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

  while (true) {
    console.log(testMenu);
    const choice = await prompt('Enter your choice (0-10): ');

    switch (choice.trim()) {
      case '1':
        await testWelcomeEmail();
        break;
      case '2':
        await testRegistrationAcceptanceEmail();
        break;
      case '3':
        await testPaymentReminderDay3();
        break;
      case '4':
        await testPaymentReminderDay6();
        break;
      case '5':
        await testPaymentConfirmationEmail();
        break;
      case '6':
        await testRegistrationCancellationEmail();
        break;
      case '7':
        await viewScheduledEmails();
        break;
      case '8':
        await viewEmailLogs();
        break;
      case '9':
        await testFullRegistrationFlow();
        break;
      case '10':
        await checkSchedulerStats();
        break;
      case '0':
        console.log('\n👋 Goodbye!\n');
        rl.close();
        process.exit(0);
      default:
        console.log('\n❌ Invalid choice. Please try again.\n');
    }

    await prompt('\nPress Enter to continue...');
  }
}

// Run the tests
runTests().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
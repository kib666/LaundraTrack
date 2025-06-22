const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample orders
  const orders = [
    {
      customer: 'John Doe',
      phone: '+1234567890',
      weight: '5kg',
      status: 'pending',
      eta: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      total: 45.00
    },
    {
      customer: 'Jane Smith',
      phone: '+1234567891',
      weight: '3kg',
      status: 'in_wash',
      eta: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      total: 35.00
    },
    {
      customer: 'Bob Wilson',
      phone: '+1234567892',
      weight: '7kg',
      status: 'ready',
      eta: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      total: 65.00
    },
    {
      customer: 'Alice Johnson',
      phone: '+1234567893',
      weight: '4kg',
      status: 'delivered',
      eta: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      total: 40.00
    }
  ];

  // Create sample appointments
  const appointments = [
    {
      customer: 'Mike Brown',
      phone: '+1234567894',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      service: 'Wash & Fold',
      notes: 'Has delicate items',
      status: 'pending'
    },
    {
      customer: 'Sarah Wilson',
      phone: '+1234567895',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      service: 'Dry Clean',
      notes: 'Urgent - needed by Friday',
      status: 'approved'
    },
    {
      customer: 'David Lee',
      phone: '+1234567896',
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      service: 'Wash & Iron',
      notes: 'Large blanket included',
      status: 'rejected',
      rejectionReason: 'Fully booked at this time'
    }
  ];

  // Insert orders
  for (const order of orders) {
    await prisma.order.create({
      data: order
    });
  }

  // Insert appointments
  for (const appointment of appointments) {
    await prisma.appointment.create({
      data: appointment
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
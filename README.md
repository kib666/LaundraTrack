# M1G Laundry Tracker

A comprehensive laundry management system built with Next.js, Prisma, and MongoDB. This application provides order tracking, appointment booking, and staff management capabilities.

## Features

- **Order Management**: Track laundry orders from pickup to delivery
- **Appointment Booking**: Schedule pickup and delivery appointments
- **Staff Dashboard**: Manage tasks and monitor productivity
- **Customer Portal**: Track orders and book appointments
- **Admin Dashboard**: Comprehensive business management interface
- **Real-time Updates**: Live status updates and countdown timers

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd M1G-Laundry-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="mongodb://localhost:27017/laundry-tracker"
   # Or for MongoDB Atlas:
   # DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/laundry-tracker"
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Push the database schema**
   ```bash
   npx prisma db push
   ```

6. **Seed the database with sample data (optional)**
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Database Schema

The application uses the following MongoDB collections:

### Orders
- Customer information (name, phone)
- Order details (weight, status, ETA, total)
- Timestamps (created, updated)

### Appointments
- Customer information (name, phone)
- Appointment details (date, service, notes, status)
- Rejection reasons (if applicable)

### Users (for future authentication)
- User credentials and roles
- Related orders and appointments

## API Endpoints

### Orders
- `GET /api/orders` - Fetch all orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/[id]` - Update order status

### Appointments
- `GET /api/appointments` - Fetch all appointments
- `POST /api/appointments` - Create new appointment
- `PATCH /api/appointments/[id]` - Update appointment status

## Usage

### Customer Portal (`/customer`)
- Track orders by order ID or phone number
- Book new appointments
- View order status and estimated delivery times

### Staff Dashboard (`/staff`)
- View assigned tasks
- Update order status (pending → in wash → ready → delivered)
- Manage deliveries
- View staff profile

### Admin Dashboard (`/admin`)
- Comprehensive order management
- Appointment calendar view
- Staff task monitoring
- Business analytics and reports

## Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── customer/          # Customer portal
│   ├── staff/             # Staff dashboard
│   └── ...
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── common/           # Shared components
│   └── ...
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── scripts/              # Database seeding
```

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma` and run `npx prisma db push`
2. **API Routes**: Create new routes in `app/api/`
3. **Components**: Add new components in `components/`
4. **Pages**: Create new pages in `app/`

### Database Operations

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (⚠️ destructive)
npx prisma db push --force-reset
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Ensure MongoDB connection string is properly configured
- Set `NODE_ENV=production`
- Run `npm run build` before deployment

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MongoDB connection string | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.

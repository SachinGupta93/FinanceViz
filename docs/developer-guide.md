# Development and Deployment Guide

This guide provides detailed instructions for developers working on the Personal Finance Tracker application.

## Local Development Setup

### Initial Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with required environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB_NAME=personal-finance
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

#### MongoDB Schema

The application uses two main collections:

1. **transactions**:
   ```typescript
   {
     _id: ObjectId,
     amount: number,
     description: string,
     category: string,
     date: string, // YYYY-MM-DD format
     budgetId: string | null,
     createdAt: Date,
     updatedAt: Date
   }
   ```

2. **budgets**:
   ```typescript
   {
     _id: ObjectId,
     amount: number,
     category: string,
     month: number, // 1-12
     year: number, // e.g., 2025
     description: string | null,
     createdAt: Date,
     updatedAt: Date
   }
   ```

### API Endpoints

#### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/:id` - Get a specific transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

#### Budgets

- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create a new budget
- `GET /api/budgets/:id` - Get a specific budget
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget

#### Analytics

- `GET /api/analytics` - Get analytics data including:
  - Total expenses
  - Monthly expenses (last 6 months)
  - Category breakdown
  - Budget comparison
  - Recent transactions

### Testing

1. Manual testing checklist:
   - Dashboard loads with charts
   - Transaction CRUD operations work
   - Budget CRUD operations work
   - Analytics displays correct data
   - Responsive design works on different screen sizes

## Deployment

### Vercel Deployment

1. Create a Vercel account
2. Link to your GitHub repository
3. Configure environment variables:
   - `MONGODB_URI` - MongoDB connection string
   - `MONGODB_DB_NAME` - Database name (personal-finance)
   - `NODE_ENV` - Set to "production"
4. Deploy the application
5. Verify all features are working in production

### Troubleshooting Deployment

If encountering issues in the deployed version:

1. Check Vercel logs for errors
2. Verify environment variables are set correctly
3. Ensure MongoDB Atlas network access allows connections from Vercel's IP addresses
4. Test API endpoints using the debug endpoints:
   - `/api/healthcheck` - Checks MongoDB connection
   - `/api/debug` - Provides detailed diagnostics

## Performance Optimization

1. The application uses:
   - Next.js API routes with dynamic rendering for real-time data
   - Client-side data fetching for dashboard analytics
   - MongoDB indexing for faster queries

2. Considerations:
   - Dashboard charts re-render on window resize
   - Data fetching includes error boundaries and loading states
   - MongoDB queries are optimized with proper indexing

# Personal Finance Tracker

A full-stack web application for tracking personal finances, managing budgets, and visualizing spending patterns.

![Finance Tracker Dashboard](https://via.placeholder.com/800x400?text=Finance+Tracker+Dashboard)

## 📋 Table of Contents

- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
  - [Dashboard](#dashboard)
  - [Transactions](#transactions)
  - [Budgets](#budgets)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Dashboard** - Visualize your financial data with interactive charts
- **Transaction Management** - Add, edit, and delete financial transactions
- **Budget Planning** - Create and manage budgets by category
- **Analytics** - Track spending patterns and budget adherence
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **API Diagnostics** - Built-in endpoints for testing MongoDB connectivity and API health

## 🌐 Live Demo

The application is deployed and available at: [https://finance-viz-gold.vercel.app](https://finance-viz-gold.vercel.app)

## 🛠️ Tech Stack

- **Frontend**:
  - [Next.js](https://nextjs.org/) - React framework for building the UI
  - [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
  - [shadcn/ui](https://ui.shadcn.com/) - UI component library
  - [Recharts](https://recharts.org/) - Data visualization library

- **Backend**:
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - API endpoints
  - [MongoDB](https://www.mongodb.com/) - NoSQL database for storing financial data

- **Deployment**:
  - [Vercel](https://vercel.com/) - Platform for hosting the application

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Start the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Set up your environment variables in a `.env.local` file (not tracked by git for security).

> ⚠️ **Important**: Never commit your `.env.local` file or share your database credentials!

## 📝 Usage Guide

For more detailed technical information, check the [Developer Guide](./docs/developer-guide.md).

### Dashboard

The dashboard provides an overview of your financial status:

- **Financial Summary Cards** - View total expenses and budget information
- **Monthly Expense Chart** - Track expenses over the past 6 months
- **Category Breakdown** - Visualize spending distribution by category
- **Budget Comparison** - Compare actual spending against budgets
- **Recent Transactions** - Quick access to your latest financial activities

### Transactions

Manage your financial transactions:

1. Navigate to the "Transactions" page
2. View the list of existing transactions
3. Add a new transaction using the form:
   - Enter the amount
   - Select a date
   - Add a description
   - Choose a category
   - Link to a budget (optional)
4. Edit or delete existing transactions as needed

> **Note:** If transactions don't appear immediately after adding or editing, refresh the page to see the latest data.

### Budgets

Create and manage your budget plans:

1. Navigate to the "Budgets" page
2. View existing budgets
3. Add a new budget:
   - Enter the budget amount
   - Select a category
   - Choose the month and year
   - Add a description (optional)
4. Monitor budget utilization and remaining amounts

> **Note:** If budgets don't update immediately after adding transactions, refresh the page to see the latest calculations.

### API Endpoints

The application provides the following API endpoints:

#### Transactions
- `GET /api/transactions` - Get all transactions (supports pagination and filtering)
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/:id` - Get a specific transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

#### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create a new budget

#### Analytics
- `GET /api/analytics` - Get financial analytics data

#### Diagnostics
- `GET /api/connection-test` - Test MongoDB connection and return server info
- `GET /api/healthcheck` - Check API health status
- `GET /api/debug` - Get detailed debugging information

## ⚠️ Troubleshooting

### Common Issues

1. **Data not updating**:
   - Sometimes after performing CRUD operations, data may not update immediately due to caching.
   - **Solution**: Refresh the page to see the latest data. The application uses server-side rendering in some places, so a refresh helps fetch the latest data.

2. **Charts not loading**:
   - If charts don't display on the dashboard, it may be due to missing data.
   - **Solution**: Add transactions and budgets, then return to the dashboard.

3. **API Errors**:
   - If you encounter API errors (500 responses), check your database connection.
   - **Solution**: 
     - Verify your environment variables are correctly set
     - Test your connection using the health check endpoints
     - Check the browser console and server logs for error messages

4. **Connection Timeout**:
   - If you experience database connection timeouts:
   - **Solution**:
     - Ensure your database instance is running
     - Check network connectivity
     - Verify network access settings if using a cloud database

### Reporting Issues

If you encounter persistent issues:
- Check the browser console for error messages
- Ensure MongoDB is accessible
- File an issue in the GitHub repository with detailed steps to reproduce

## 📦 Deployment

The application is optimized for deployment on Vercel:

1. Fork or clone this repository
2. Create a Vercel account and link it to your GitHub account
3. Create a new project in Vercel, linking to your repository
4. Add the required environment variables in the deployment settings (refer to your local `.env.example` file)
5. Deploy your project
6. **Important:** Configure proper network access settings for your database to allow connections from your deployment platform
7. Verify your application works by testing all features after deployment

### Troubleshooting Deployment

If you encounter issues after deployment:

1. Check the Vercel deployment logs for any errors
2. Verify all environment variables are correctly set in the deployment platform
3. Test the API health check endpoints
4. Check database logs for connection issues
5. Use browser developer tools to check for API errors in the console

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

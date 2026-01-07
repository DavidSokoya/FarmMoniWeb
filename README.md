## FarmMoni (Web Version -- MERN Stack)

[Live Demo Here](#)

A comprehensive **Fintech Investment Platform** that bridges the gap
between digital investors and agricultural projects. Users can fund
their wallets, invest in farm cycles, and withdraw returns, while
**Admins** manage the entire economic flow.

------------------------------------------------------------------------

## Technologies Used

-   **MongoDB**
-   **Express.js**
-   **React**
-   **Node.js**
-   **Paystack** (Payment Gateway)

------------------------------------------------------------------------

## Key Learning Focus

My learning was focused on building a **secure financial loop**,
ensuring that money flows correctly through the system:

**Payment Gateway (Paystack) → User Wallet → Investment → ROI Payout →
Bank Withdrawal**

This was implemented with strict validations and transactional
consistency to prevent data loss or financial discrepancies.

------------------------------------------------------------------------

## Optimizations

When improving this project in the future, I would implement **Email
Notifications** using **Nodemailer** to alert users immediately when: -
A withdrawal request is approved - An investment matures

This would reduce the need for users to constantly check the dashboard
for updates.

------------------------------------------------------------------------

## Lessons Learned

-   In **Fintech applications**, server uptime is critical. Relying on
    free-tier hosting introduced issues with *sleeping servers*, which
    caused missed payment webhooks.
-   I also learned the power of **MongoDB Aggregations** for generating
    complex admin statistics efficiently using a single query.

------------------------------------------------------------------------

## More Projects

-   **Arduino Project Showcase**
-   **Rent Management Platform**
-   **FarmMoni E-commerce**

------------------------------------------------------------------------

## Installation

``` bash
git clone <repo-url>
cd <project-folder>
npm install
```

------------------------------------------------------------------------

## Environment Variables

Create a `.env` file in the root directory and add the required
environment variables:

``` env
MONGO_URI=your_mongodb_connection_string
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
JWT_SECRET=your_jwt_secret
```

------------------------------------------------------------------------

## Run the Application

### Backend

``` bash
npm run server
```

### Frontend

``` bash
npm start
```

The application will be available at **http://localhost:3000**.

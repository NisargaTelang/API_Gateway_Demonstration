# API Gateway for Distributed Microservices (Demo E-Commerce Ecosystem)

This project is primarily an API Gateway System built using:

- Node.js + Express + TypeScript (Core API Gateway)
- JWT Authentication + Role-Based Routing
- Reverse Proxy with Service Isolation
- Rate Limiting, CORS, Static File Serving
- Centralized security layer for microservices

To demonstrate the capabilities of this API Gateway, the repository includes a full set of supporting microservices:

- Auth-service (Spring Boot)
- Product-service (Spring Boot)
- Order-service (Spring Boot)
- Payment-service (Spring Boot)
- React Frontend
- PostgreSQL + Redis

These services exist only to showcase how the Gateway securely handles routing, authentication, rate limiting, static file access, and role-based access control.

## Project Structure

    gateway-project-custom/
    │
    ├── API-gateway                 # Node.js reverse proxy + JWT verification
    ├── Auth-service                # User registration, login, JWT
    ├── Product-service             # Product CRUD + image uploads
    ├── Order-service               # Order creation & management
    ├── Payment-service             # Payment & invoice PDF generation
    ├── E-Commerce                  # React + Vite frontend
    ├── docker-compose.yml
    └── .env

## Requirements

    1. Create required folders for file storage
        By default, the system expects these directories on your D: drive:

            D:/gateway-files/
            D:/gateway-files/products
            D:/gateway-files/bills

            These are used to store:
                - Product Images → `products/`
                - Invoice PDF Bills → `bills/`

            If these folders don’t exist, create them before running the system.

    2. Folder Location Is Customizable
        You are free to choose any directory path on your system (any drive, any folder).  
        Just make sure you update these environment variables in `.env` accordingly:
            -HOST_FILES_ROOT=YOUR_CUSTOM_PATH
            -HOST_PRODUCTS_DIR=YOUR_CUSTOM_PATH/products
            -HOST_BILLS_DIR=YOUR_CUSTOM_PATH/bills

    As long as the paths exist and match what you set in `.env`, the system will work normally.

    3. Software Requirements
        - Docker Desktop  
        - Java 21 (only needed if running Spring services manually)  
        - Node.js 18+ (only needed if running frontend manually)  


# Running the Entire System

    # STEP 1 : Open the command prompt in project root and run the below command :
            docker-compose up --build

            This starts:

            Service	            Port	Description
            PostgreSQL	        5432	Database
            Redis	            6379	Cache
            Auth-service	    8080	Authentication
            Product-service	    8081	Products
            Order-service	    8082	Orders
            Payment-service	    8083	Payments & Billing
            API Gateway	        3000	Unified backend
            Frontend	        8085	React UI

            Wait until all microservices show Started.

    # STEP 2 : Create the ADMIN User
        - Admin is not auto-created.

        - Run this API once after everything is running:
            POST http://localhost:3000/auth/register

            Body:
            {
                "fullName": "Admin",
                "email": "admin@gmail.com",
                "password": "admin123",
                "mobileNo": "1234567890",
                "role": "ADMIN"
            }


        - Login afterward using:
            Email: admin@gmail.com
            Password: admin123

        - The frontend auto-redirects based on role.

    System is Ready to Use, Register a user using the register page, and admin is registered already now you can login based on your role

# Role-based Access & API Rules
    - Product Service
        - Action:               Who Can Do It?
        - Create product	    ADMIN Only
        - Update product	    ADMIN Only
        - Delete product	    ADMIN Only
        - Get all products	    Public (No JWT)
        - Get product by ID	    Public (No JWT)

    - Order Service (All Endpoints Require JWT)
        -The Order service exposes 4 main APIs:

            1. Create order
            POST /orders
                Used by users when they check out. Requires valid JWT.

            2. Get orders by email
            GET /orders/:email
                User fetches their own orders.

            3. Admin fetch all orders
            GET /orders/admin/all-orders
                Admin-only list of all orders.

            4. Update order status
            POST /orders/status
               Valid statuses:
                    CREATED
                    PAID
                    CANCELLED
                Used by:
                    Payment service (sets PAID)


    - Payment Service (Through API Gateway)
        - Protected Endpoints (Require JWT)
            POST /payments                  → make payment for an order
            GET  /payments/pdf/:orderId     → secure PDF fetch
            GET  /payments/:orderId         → fetch payment info

        These routes in Gateway enforce:
            -verifyJWT()
            -rateAuth()

    - Public Endpoint (No JWT)

        -Invoice PDFs are public:
            GET /payments/bills/:fileName
            This allows:
                Customers to download invoices directly from email links
                Frontend to show bill download option
    
# Full System Workflow (End-to-End)
    1. User opens frontend → requests come to API Gateway
        Gateway handles:
            -CORS
            -JSON parsing
            -JWT verification (protected routes)
            -Rate limiting
            -Reverse proxying
            -Serving images / invoices

    2. Registration & Login
        -Auth-service handles all login/register logic.
        -JWT is returned & saved in browser localStorage.

    3. Browsing Products
        -Products are public, no login required.
        -Admin uses privileged routes for CRUD operations.

    4. Placing an Order
        -User creates an order → Order service saves it in CREATED state.

    5. Payment
        -User makes a payment:
        -Payment service validates the order
        -Saves payment record
        -Updates accompanying order to PAID
        -Generates PDF invoice
        -Stores it under /data/bills
        -Returns public invoice link:
            -http://localhost:3000/payments/bills/BILL_xxx.pdf

    6. Admin Dashboard
        -Admin can:
        -Manage products
        -View all orders
        -Update order statuses
        -Inspect payments

# Environment Variables

    Example .env:

    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=api_gateway

    PG_PORT=5432
    REDIS_PORT=6379

    GATEWAY_PORT=3000
    FRONTEND_PORT=8085

    JWT_SECRET=YOUR_256_BIT_SECRET_KEY

    HOST_PRODUCTS_DIR=D:/gateway-project-custom/uploads/products
    HOST_BILLS_DIR=D:/gateway-project-custom/uploads/bills

# Stopping System
    -Stop containers:
        docker-compose down

    -Remove containers + volumes:
        docker-compose down -v
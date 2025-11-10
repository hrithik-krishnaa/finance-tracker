Finance Tracker
Overview

Finance Tracker is a full-stack web application that allows users to manage their income and expenses efficiently.
It provides an interactive dashboard with charts, month-wise transaction tracking, and AI-generated financial insights to help users understand their spending and saving patterns.

Features

Add, edit, and view income and expense transactions

Filter transactions by month

View total income, expenses, and savings for each month

Visual representation of financial data using charts

AI-based insights for cost-cutting and savings suggestions

Secure user authentication system

Tech Stack

Frontend:

Angular

Chart.js and ng2-charts

Bootstrap / SCSS

Backend:

ASP.NET Core Web API

Entity Framework Core

SQLite Database

Installation and Setup
Backend Setup

Open a terminal and navigate to:

cd backend/FinanceApi


Restore dependencies and run the application:

dotnet restore
dotnet ef database update
dotnet run


The API will be available at http://localhost:5041.

Frontend Setup

Open a new terminal and navigate to:

cd frontend


Install dependencies and run the Angular app:

npm install
ng serve --proxy-config proxy.conf.json --open


The frontend will open automatically at http://localhost:4200.

Project Structure
finance-tracker/
│
├── backend/
│   └── FinanceApi/
│       ├── Controllers/
│       ├── Models/
│       ├── Services/
│       └── finance_tracker.db
│
├── frontend/
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
└── README.md

Developer

Developed by Hrithik Krishna
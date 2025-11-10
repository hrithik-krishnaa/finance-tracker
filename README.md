# **Finance Tracker**
A full-stack **personal finance tracking application** designed to help users manage their income, expenses, and savings efficiently. It provides visual insights using charts, AI-based expense suggestions, and monthly summaries for better financial planning.

---

## **Features**
- User authentication (Register & Login)  
- Add, view, and manage transactions (Income & Expenses)  
- Monthly filtering to view specific transaction data  
- Pie chart showing **Income vs Expenses**  
- Bar chart showing **Monthly Savings Trends**  
- AI-based insights providing:  
  - Spending and saving tips  
  - Monthly performance comparisons  
  - Suggestions on where to reduce expenses  
- Clean and responsive dashboard interface  

---

## **Tech Stack**
**Frontend:** Angular, TypeScript, HTML, SCSS, Chart.js, ng2-charts  
**Backend:** ASP.NET Core Web API, C#, Entity Framework Core, SQLite Database  

---

## **Project Structure**
finance-tracker/  
│  
├── backend/  
│   ├── FinanceApi/  
│   │   ├── Controllers/  
│   │   ├── Data/  
│   │   ├── Models/  
│   │   ├── Program.cs  
│   │   └── appsettings.json  
│   └── finance_tracker.db  
│  
├── frontend/  
│   ├── src/  
│   │   ├── app/  
│   │   │   ├── components/  
│   │   │   ├── pages/  
│   │   │   ├── services/  
│   │   │   └── app.routes.ts  
│   │   ├── index.html  
│   │   ├── main.ts  
│   │   └── styles.scss  
│   ├── angular.json  
│   ├── package.json  
│   └── tsconfig.json  
│  
└── README.md  

---

## **Setup Instructions**

### **1. Clone the repository**
git clone https://github.com/<your-username>/finance-tracker.git  
cd finance-tracker  

### **2. Backend setup**
cd backend/FinanceApi  
dotnet restore  
dotnet run  
Your backend will start at: **http://localhost:5041/swagger**  

### **3. Frontend setup**
cd frontend  
npm install  
ng serve --proxy-config proxy.conf.json --open  
Your frontend will start at: **http://localhost:4200**  

---

## **Usage**
1. Register or Login to your account.  
2. Add income and expense transactions.  
3. Filter transactions by month.  
4. View insights, charts, and savings trends.  
5. Get AI-based financial suggestions.  

---

## **Future Enhancements**
- Add export to CSV or Excel feature.  
- Enable multi-user account management.  
- Integrate currency conversion API.  
- Add dark mode and mobile optimization.  

---

## **Author**
**Hrithik Krishna**  

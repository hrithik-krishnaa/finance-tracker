import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ApiService } from '../../services/api';
import { NavbarComponent } from '../../components/navbar/navbar';
import { AiInsightsComponent } from '../../components/ai-insights/ai-insights';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, NavbarComponent, AiInsightsComponent, DatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  user: any = null;
  transactions: any[] = [];
  filteredTransactions: any[] = [];

  type = 'Income';
  category = '';
  amount: number | null = null;
  date = '';
  selectedMonth = '';

  pieData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#4CAF50', '#F44336'], // ✅ Green = Income, Red = Expense
        hoverBackgroundColor: ['#66BB6A', '#E57373']
      }
    ]
  };

  barData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Monthly Savings',
        data: [],
        backgroundColor: '#FFB6C1' // 🎨 Light pink for savings
      }
    ]
  };

  pieOptions = { responsive: true };
  barOptions = { responsive: true };

  constructor(private api: ApiService) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.getTransactions();
    }
  }

  getTransactions() {
    const token = localStorage.getItem('token');
    if (!this.user || !token) return;

    console.log('Fetching transactions for user:', this.user.id);

    this.api.getTransactions(this.user.id, token).subscribe({
      next: (res: any) => {
        console.log('Fetched transactions:', res);
        this.transactions = res || [];
        this.filterTransactions();
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
      }
    });
  }

  add() {
    if (!this.category || !this.amount || !this.date) {
      alert('Please fill all fields before adding a transaction.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token') || '';

    const payload = {
      userId: user.id.toString(),
      type: this.type,
      category: this.category,
      amount: this.amount,
      date: this.date
    };

    console.log('Sending payload:', payload);
    console.log('Using token:', token);

    this.api.addTransaction(payload, token).subscribe({
      next: (res: any) => {
        console.log('Transaction added successfully:', res);
        this.transactions.push(res);
        this.filterTransactions();
        this.category = '';
        this.amount = null;
        this.date = '';
      },
      error: (err) => {
        console.error('Error adding transaction:', err);
      }
    });
  }

  filterTransactions() {
    if (!this.selectedMonth) {
      this.filteredTransactions = [...this.transactions];
    } else {
      this.filteredTransactions = this.transactions.filter(t => {
        const month = new Date(t.date).toISOString().slice(0, 7);
        return month === this.selectedMonth;
      });
    }
    this.updateCharts();
  }

  updateCharts() {
    const dataSource = this.filteredTransactions.length ? this.filteredTransactions : this.transactions;

    const income = dataSource
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = dataSource
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    this.pieData = {
      labels: ['Income', 'Expense'],
      datasets: [
        {
          data: [income, expense],
          backgroundColor: ['#4CAF50', '#F44336'], // ✅ Consistent colors
          hoverBackgroundColor: ['#66BB6A', '#E57373']
        }
      ]
    };

    const months: string[] = [];
    const monthlySavings: number[] = [];

    const grouped = dataSource.reduce((acc: any, t: any) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[month]) acc[month] = { income: 0, expense: 0 };
      if (t.type === 'Income') acc[month].income += Number(t.amount);
      else acc[month].expense += Number(t.amount);
      return acc;
    }, {});

    Object.keys(grouped).forEach(m => {
      months.push(m);
      monthlySavings.push(grouped[m].income - grouped[m].expense);
    });

    this.barData = {
      labels: months,
      datasets: [
        {
          label: 'Monthly Savings',
          data: monthlySavings,
          backgroundColor: '#FFB6C1' // ✅ Light pink for monthly savings
        }
      ]
    };
  }
}

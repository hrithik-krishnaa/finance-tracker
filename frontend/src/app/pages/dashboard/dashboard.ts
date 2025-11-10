import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { ApiService } from '../../services/api';
import { NavbarComponent } from '../../components/navbar/navbar';
import { AiInsightsComponent } from '../../components/ai-insights/ai-insights';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    NavbarComponent,
    AiInsightsComponent,
    DatePipe
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  type = '';
  category = '';
  amount = '';
  date = '';
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  selectedMonth: string = '';
  user: any;

  pieData!: ChartData<'pie'>;
  barData!: ChartData<'bar'>;
  pieOptions: any;
  barOptions: any;

  constructor(private api: ApiService) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.fetchTransactions();
    }
  }

  fetchTransactions() {
    const token = localStorage.getItem('token');
    if (!token || !this.user) return;

    this.api.getTransactions(this.user.id, token).subscribe({
      next: (res) => {
        this.transactions = res || [];
        this.filteredTransactions = [...this.transactions];
        this.updateCharts();
      },
      error: (err) => console.error('Error fetching transactions:', err)
    });
  }

  add() {
    const token = localStorage.getItem('token');
    if (!this.type || !this.category || !this.amount || !this.date) {
      alert('Please fill all fields.');
      return;
    }

    const payload = {
      userId: this.user.id,
      type: this.type,
      category: this.category,
      amount: Number(this.amount),
      date: this.date,
      createdAt: new Date()
    };

    this.api.addTransaction(payload, token || '').subscribe({
      next: () => {
        alert('✅ Transaction added successfully!');
        this.fetchTransactions();
        this.type = this.category = this.amount = this.date = '';
      },
      error: (err) => {
        console.error('Error adding transaction:', err);
        alert('Error adding transaction.');
      }
    });
  }

  filterTransactions() {
    if (!this.selectedMonth) {
      this.filteredTransactions = [...this.transactions];
      this.updateCharts();
      return;
    }

    const [year, month] = this.selectedMonth.split('-').map(Number);
    const filtered = this.transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    });

    // If no data found for that month — show empty data instead of everything
    this.filteredTransactions = filtered.length ? filtered : [];
    this.updateCharts();
  }

  updateCharts() {
    const source = this.filteredTransactions.length
      ? this.filteredTransactions
      : [];

    const income = source
      .filter((t) => t.type.toLowerCase() === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = source
      .filter((t) => t.type.toLowerCase() === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = income - expense;

    // PIE CHART — Income vs Expense
    this.pieData = {
      labels: ['Income', 'Expense'],
      datasets: [
        {
          data: [income, expense],
          backgroundColor: ['#4CAF50', '#F44336']
        }
      ]
    };

    // BAR CHART — Monthly Savings Trend
    this.barData = {
      labels: ['Savings'],
      datasets: [
        {
          label: 'Monthly Savings',
          data: [savings > 0 ? savings : 0],
          backgroundColor: ['#43A047']
        }
      ]
    };

    this.pieOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    };

    this.barOptions = {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { position: 'bottom' }
      }
    };
  }
}

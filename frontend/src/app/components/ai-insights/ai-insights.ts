import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-insights.html',
  styleUrls: ['./ai-insights.scss']
})
export class AiInsightsComponent implements OnChanges {
  @Input() transactions: any[] = [];

  insight: string = '';
  actionableSuggestions: string[] = [];

  ngOnChanges(): void {
    this.actionableSuggestions = [];
    if (!this.transactions || this.transactions.length === 0) {
      this.insight = '';
      return;
    }

    const income = this.sumByType('income');
    const expense = this.sumByType('expense');
    const savings = income - expense;
    const topExpenseCategory = this.getTopExpenseCategory();

    if (savings >= 0) {
      this.insight = `Great job, ${localStorage.getItem('username') || 'User'}! You saved ₹${savings} this period.`;
    } else {
      this.insight = `Careful ${localStorage.getItem('username') || 'User'}! Your expenses exceeded your income by ₹${Math.abs(savings)}.`;
    }

    // --- suggestions (only on expense categories)
    if (topExpenseCategory) {
      this.actionableSuggestions.push(`Reduce spending in "${topExpenseCategory}" by 10% — small cuts add up.`);
      this.actionableSuggestions.push(`Set a monthly budget for "${topExpenseCategory}".`);
    }

    const expenseBreakdown = this.getExpenseBreakdown();
    const biggest = Object.entries(expenseBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    biggest.forEach(([cat, val]) => {
      this.actionableSuggestions.push(`Consider cheaper alternatives for "${cat}" — you spent ₹${Math.round(val)}.`);
    });

    if (expense > income * 0.8) {
      this.actionableSuggestions.push('Try to reduce non-essential spending to keep savings above 20% of income.');
    }
    if (savings < income * 0.1) {
      this.actionableSuggestions.push('Aim to save at least 10% of income each month.');
    }
  }

  private sumByType(type: string) {
    return this.transactions
      .filter(t => (t.type || '').toLowerCase() === type.toLowerCase())
      .reduce((s, t) => s + Number(t.amount || 0), 0);
  }

  private getTopExpenseCategory(): string | null {
    const map: Record<string, number> = {};
    this.transactions
      .filter(t => (t.type || '').toLowerCase() === 'expense')
      .forEach(t => {
        const c = t.category || 'Misc';
        map[c] = (map[c] || 0) + Number(t.amount || 0);
      });
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return sorted.length ? sorted[0][0] : null;
  }

  private getExpenseBreakdown(): Record<string, number> {
    const map: Record<string, number> = {};
    this.transactions
      .filter(t => (t.type || '').toLowerCase() === 'expense')
      .forEach(t => {
        const c = t.category || 'Misc';
        map[c] = (map[c] || 0) + Number(t.amount || 0);
      });
    return map;
  }
}

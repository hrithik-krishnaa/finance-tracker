using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FinanceApi.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace FinanceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InsightsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InsightsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetInsights()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var now = DateTime.UtcNow;
            var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
            var startOfPrevMonth = startOfThisMonth.AddMonths(-1);
            var startOfTwoMonthsBack = startOfPrevMonth.AddMonths(-1);

            var userTx = _context.Transactions
                .Where(t => t.UserId == userId);

            var totalIncome = await userTx.Where(t => t.Type.ToLower() == "income").SumAsync(t => (decimal?)t.Amount) ?? 0;
            var totalExpense = await userTx.Where(t => t.Type.ToLower() == "expense").SumAsync(t => (decimal?)t.Amount) ?? 0;
            var balance = totalIncome - totalExpense;

            // Category sums (all time)
            var categories = await userTx
                .GroupBy(t => t.Category.ToLower())
                .Select(g => new { Category = g.Key, Sum = g.Sum(t => t.Amount) })
                .OrderByDescending(g => g.Sum)
                .ToListAsync();

            // Monthly aggregates for savings (income - expense per month) for last 6 months
            var monthStart = now.AddMonths(-5);
            var monthlyAggregates = await userTx
                .Where(t => t.Date >= new DateTime(monthStart.Year, monthStart.Month, 1))
                .GroupBy(t => new { t.Date.Year, t.Date.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Income = g.Where(x => x.Type.ToLower() == "income").Sum(x => (decimal?)x.Amount) ?? 0,
                    Expense = g.Where(x => x.Type.ToLower() == "expense").Sum(x => (decimal?)x.Amount) ?? 0
                })
                .OrderBy(a => a.Year).ThenBy(a => a.Month)
                .ToListAsync();

            // Compare this month vs previous month
            var thisMonthIncome = await userTx.Where(t => t.Date >= startOfThisMonth).Where(t => t.Type.ToLower() == "income").SumAsync(t => (decimal?)t.Amount) ?? 0;
            var thisMonthExpense = await userTx.Where(t => t.Date >= startOfThisMonth).Where(t => t.Type.ToLower() == "expense").SumAsync(t => (decimal?)t.Amount) ?? 0;

            var prevMonthIncome = await userTx.Where(t => t.Date >= startOfPrevMonth && t.Date < startOfThisMonth).Where(t => t.Type.ToLower() == "income").SumAsync(t => (decimal?)t.Amount) ?? 0;
            var prevMonthExpense = await userTx.Where(t => t.Date >= startOfPrevMonth && t.Date < startOfThisMonth).Where(t => t.Type.ToLower() == "expense").SumAsync(t => (decimal?)t.Amount) ?? 0;

            decimal incomeChangePct = prevMonthIncome == 0 ? (thisMonthIncome == 0 ? 0 : 100) : Math.Round((thisMonthIncome - prevMonthIncome) / prevMonthIncome * 100, 2);
            decimal expenseChangePct = prevMonthExpense == 0 ? (thisMonthExpense == 0 ? 0 : 100) : Math.Round((thisMonthExpense - prevMonthExpense) / prevMonthExpense * 100, 2);

            // Top expense category (this month)
            var topExpenseCategoryThisMonth = await userTx
                .Where(t => t.Date >= startOfThisMonth && t.Type.ToLower() == "expense")
                .GroupBy(t => t.Category.ToLower())
                .Select(g => new { Category = g.Key, Sum = g.Sum(t => t.Amount) })
                .OrderByDescending(g => g.Sum)
                .FirstOrDefaultAsync();

            // Suggestions
            string cutSuggestion = null;
            if (topExpenseCategoryThisMonth != null)
            {
                // recommend cutting 10% of that category this month
                cutSuggestion = $"Try cutting 10% from {topExpenseCategoryThisMonth.Category} — that's around ₹{Math.Round(topExpenseCategoryThisMonth.Sum * 0.1m, 0)} this month.";
            }

            // Savings recommendation: suggest saving 10% of this month's income (or a fixed small amt)
            var savingsSuggestion = thisMonthIncome > 0 ? $"You could try saving {Math.Round(thisMonthIncome * 0.10m, 0):N0} (10% of this month's income)." : "Add incomes to get tailored savings suggestions.";

            // Compose a few natural language insights
            var insights = new List<string>();
            insights.Add($"You saved ₹{Math.Round(thisMonthIncome - thisMonthExpense, 0):N0} this month.");
            if (expenseChangePct > 5) insights.Add($"Your expenses increased by {expenseChangePct}% vs last month.");
            else if (expenseChangePct < -5) insights.Add($"Great — your expenses decreased by {Math.Abs(expenseChangePct)}% vs last month.");
            if (incomeChangePct > 0) insights.Add($"Your income changed by {incomeChangePct}% vs last month.");

            if (topExpenseCategoryThisMonth != null)
            {
                insights.Add($"Top expense this month: {topExpenseCategoryThisMonth.Category} (₹{Math.Round(topExpenseCategoryThisMonth.Sum, 0)})");
            }

            var monthlySavings = monthlyAggregates
                .Select(m => new {
                    label = new DateTime(m.Year, m.Month, 1).ToString("MMM yyyy"),
                    value = (m.Income - m.Expense)
                }).ToList();

            var categoryList = categories.Select(c => new { c.Category, Amount = Math.Round(c.Sum, 0) }).ToList();

            var result = new
            {
                totals = new { totalIncome = Math.Round(totalIncome, 0), totalExpense = Math.Round(totalExpense, 0), balance = Math.Round(balance, 0) },
                categorySums = categoryList,
                monthlySavings = monthlySavings,
                incomeChangePct,
                expenseChangePct,
                insights,
                cutSuggestion,
                savingsSuggestion
            };

            return Ok(result);
        }
    }
}

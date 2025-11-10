using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;  // Income or Expense
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }  // Numeric value
        public DateTime Date { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

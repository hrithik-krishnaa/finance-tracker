using Microsoft.AspNetCore.Mvc;
using FinanceApi.Models;
using FinanceApi.Data;

namespace FinanceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public IActionResult AddTransaction([FromBody] Transaction transaction)
        {
            if (transaction == null)
                return BadRequest("Invalid transaction data.");

            if (string.IsNullOrEmpty(transaction.UserId))
                return BadRequest("UserId is required.");

            if (transaction.Amount <= 0)
                return BadRequest("Amount must be greater than zero.");

            transaction.CreatedAt = DateTime.Now;

            _context.Transactions.Add(transaction);
            _context.SaveChanges();

            return Ok(transaction);
        }

        [HttpGet("{userId}")]
        public IActionResult GetTransactions(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId is required.");

            var transactions = _context.Transactions
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.Date)
                .ToList();

            return Ok(transactions);
        }
    }
}

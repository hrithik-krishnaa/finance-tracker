using Microsoft.EntityFrameworkCore;
using FinanceApi.Models;

namespace FinanceApi.Data;
public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> opt) : base(opt) {}
    public DbSet<User> Users => Set<User>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
}

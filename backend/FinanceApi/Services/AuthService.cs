using FinanceApi.Data;
using FinanceApi.Models;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace FinanceApi.Services;
public class AuthService {
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    public AuthService(AppDbContext db, IConfiguration config){ _db=db; _config=config; }

    public async Task<User> Register(string email,string pass,string name){
        if(_db.Users.Any(u=>u.Email==email)) throw new Exception("Email exists");
        var u=new User{Email=email,FullName=name,PasswordHash=Hash(pass)};
        _db.Users.Add(u); await _db.SaveChangesAsync(); return u;
    }

    public async Task<(User,string)> Login(string email,string pass){
        var u=_db.Users.FirstOrDefault(x=>x.Email==email);
        if(u==null||!Verify(pass,u.PasswordHash)) throw new Exception("Invalid login");
        return (u,Token(u));
    }

    private string Hash(string pass){
        using var sha=SHA256.Create();
        return Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(pass)));
    }
    private bool Verify(string pass,string hash)=>Hash(pass)==hash;

    private string Token(User u){
        var key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds=new SigningCredentials(key,SecurityAlgorithms.HmacSha256);
        var claims=new[]{
            new Claim(ClaimTypes.NameIdentifier,u.Id.ToString()),
            new Claim(ClaimTypes.Email,u.Email)
        };
        var token=new JwtSecurityToken(
            issuer:_config["Jwt:Issuer"],audience:_config["Jwt:Audience"],
            claims:claims,expires:DateTime.UtcNow.AddHours(6),
            signingCredentials:creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

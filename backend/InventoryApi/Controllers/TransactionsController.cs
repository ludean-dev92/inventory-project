using Microsoft.AspNetCore.Mvc;
using InventoryApi.Data;
using InventoryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly InventoryDbContext _context;
    public TransactionsController(InventoryDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Transaction>> GetTransactions()
    {
        try
        {
            var transactions = _context.Transactions.ToList();
            return Ok(transactions);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error interno: {ex.Message}");
        }
    }

    [HttpPost]
    public ActionResult<Transaction> PostTransaction(Transaction transaction)
    {
        try
        {
            var product = _context.Products.Find(transaction.ProductId);
            if (product == null) return BadRequest("Producto no existe");

            if (transaction.Type == "Venta")
            {
                if (product.Stock < transaction.Quantity)
                {
                    return BadRequest("Stock insuficiente");
                }
                product.Stock -= transaction.Quantity;
            }
            else if (transaction.Type == "Compra")
            {
                product.Stock += transaction.Quantity;
            }
            else
            {
                return BadRequest("Tipo inválido (Compra o Venta)");
            }

            transaction.UnitPrice = product.Price;
            transaction.Total = product.Price * transaction.Quantity;
            transaction.Date = DateTime.Now;

            _context.Transactions.Add(transaction);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetTransactions), new { id = transaction.Id }, transaction);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al crear la transacción: {ex.Message}");
        }
    }
}

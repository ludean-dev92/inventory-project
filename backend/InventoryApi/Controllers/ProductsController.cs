using Microsoft.AspNetCore.Mvc;
using InventoryApi.Data;
using InventoryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly InventoryDbContext _context;
    public ProductsController(InventoryDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetProducts()
    {
        try
        {
            var products = _context.Products.ToList();
            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error interno: {ex.Message}");
        }
    }

    [HttpGet("{id}")]
    public ActionResult<Product> GetProduct(int id)
    {
        try
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound($"Producto con id {id} no encontrado");
            return product;
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error interno: {ex.Message}");
        }
    }

    [HttpPost]
    public ActionResult<Product> PostProduct(Product product)
    {
        try
        {
            _context.Products.Add(product);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al crear producto: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public IActionResult UpdateProduct(int id, Product product)
    {
        try
        {
            if (id != product.Id) return BadRequest("El ID no coincide con el producto");

            _context.Entry(product).State = EntityState.Modified;
            _context.SaveChanges();
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            return NotFound($"Producto con id {id} no encontrado para actualizar");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al actualizar producto: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteProduct(int id)
    {
        try
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound($"Producto con id {id} no encontrado");

            _context.Products.Remove(product);
            _context.SaveChanges();
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al eliminar producto: {ex.Message}");
        }
    }
}

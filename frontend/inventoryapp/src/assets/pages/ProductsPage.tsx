import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { getProducts, createProduct, type Product } from "../services/productService";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ name: string; price: number; stock: number }>({
    name: "",
    price: 0,
    stock: 0,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showMessage = (msg: string, severity: "success" | "error" = "success") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const loadProducts = async () => {
    try {
      const list = await getProducts();
      setProducts(list);
    } catch (err) {
      console.error(err);
      showMessage("Error al cargar productos", "error");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  const handleSubmit = async () => {
    try {
      await createProduct(form as Product);
      showMessage("Producto agregado correctamente", "success");
      handleClose();
      setForm({ name: "", price: 0, stock: 0 });
      loadProducts();
    } catch (err) {
      console.error(err);
      showMessage("Error al agregar producto", "error");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Productos
      </Typography>
      <Button variant="contained" onClick={loadProducts} sx={{ mr: 2 }}>
        Recargar
      </Button>
      <Button variant="outlined" onClick={handleOpen}>
        Agregar Producto
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Producto</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Nombre" name="name" fullWidth value={form.name} onChange={handleChange} />
          <TextField margin="dense" label="Precio" name="price" type="number" fullWidth value={form.price} onChange={handleChange} />
          <TextField margin="dense" label="Stock" name="stock" type="number" fullWidth value={form.stock} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

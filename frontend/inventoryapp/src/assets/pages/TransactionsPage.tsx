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
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { getTransactions, createTransaction, type Transaction } from "../services/transactionService";
import { getProducts, type Product } from "../services/productService";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<Transaction>({
    productId: 0,
    type: "Compra",
    quantity: 1,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showMessage = (msg: string, severity: "success" | "error" = "success") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const loadTransactions = async () => {
    try {
      const list = await getTransactions();
      setTransactions(list);
    } catch (err) {
      console.error(err);
      showMessage("Error al cargar transacciones", "error");
    }
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
    loadTransactions();
    loadProducts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "quantity" || name === "productId" ? Number(value) : value });
  };

  const handleSubmit = async () => {
    try {
      await createTransaction(form);
      showMessage("Transacción registrada correctamente", "success");
      handleClose();
      setForm({ productId: 0, type: "Compra", quantity: 1 });
      loadTransactions();
    } catch (err) {
      console.error(err);
      showMessage("Error al registrar transacción", "error");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Transacciones
      </Typography>
      <Button variant="contained" onClick={loadTransactions} sx={{ mr: 2 }}>
        Recargar
      </Button>
      <Button variant="outlined" onClick={handleOpen}>
        Registrar Transacción
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{products.find((p) => p.id === t.productId)?.name || "Desconocido"}</TableCell>
                <TableCell>{t.type}</TableCell>
                <TableCell>{t.quantity}</TableCell>
                <TableCell>${t.unitPrice}</TableCell>
                <TableCell>${t.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Registrar Transacción</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Producto"
            name="productId"
            fullWidth
            value={form.productId}
            onChange={handleChange}
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name} (Stock: {p.stock})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            margin="dense"
            label="Tipo"
            name="type"
            fullWidth
            value={form.type}
            onChange={handleChange}
          >
            <MenuItem value="Compra">Compra</MenuItem>
            <MenuItem value="Venta">Venta</MenuItem>
          </TextField>

          <TextField
            margin="dense"
            label="Cantidad"
            name="quantity"
            type="number"
            fullWidth
            value={form.quantity}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Guardar
          </Button>
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

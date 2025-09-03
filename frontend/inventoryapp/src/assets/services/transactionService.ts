import api from "./api";

export interface Transaction {
  id?: number;
  productId: number;
  type: "Compra" | "Venta";
  quantity: number;
  unitPrice?: number;
  total?: number;
  date?: string;
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await api.get("/transactions");
  return response.data;
}

export async function createTransaction(transaction: Transaction): Promise<Transaction> {
  const response = await api.post("/transactions", transaction);
  return response.data;
}

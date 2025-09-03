import api from "./api";

export interface Product {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
}

export async function getProducts(): Promise<Product[]> {
  const response = await api.get("/products");
  return response.data;
}

export async function createProduct(product: Product): Promise<Product> {
  const response = await api.post("/products", product);
  return response.data;
}

export async function updateProduct(id: number, product: Product): Promise<void> {
  await api.put(`/products/${id}`, product);
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}

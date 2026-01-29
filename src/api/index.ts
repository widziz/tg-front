// API URL - замените на ваш backend URL после деплоя
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  emoji: string;
}

interface CreateInvoiceResponse {
  success: boolean;
  invoiceLink?: string;
  error?: string;
}

interface ProductsResponse {
  success: boolean;
  products: Product[];
}

// Создание инвойса для оплаты в Stars
export async function createInvoice(
  initData: string,
  productId: string,
  title: string,
  description: string,
  price: number
): Promise<CreateInvoiceResponse> {
  const response = await fetch(`${API_URL}/api/create-invoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': initData,
    },
    body: JSON.stringify({
      productId,
      title,
      description,
      price,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create invoice');
  }

  return response.json();
}

// Получение списка продуктов
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/api/products`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data: ProductsResponse = await response.json();
  return data.products;
}

// Проверка статуса сервера
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}

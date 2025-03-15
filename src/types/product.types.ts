
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  paymentLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface para o formulário do produto
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  paymentLink: string;
  isActive: boolean;
}

// Interface para mapear entre formato de banco de dados e front-end
export interface ProductDatabaseMapping {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  payment_link: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

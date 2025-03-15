
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  paymentLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  paymentLink: string;
  isActive: boolean;
};

// Tipo para mapear entre o frontend e o banco de dados
export type ProductDatabaseMapping = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  payment_link: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

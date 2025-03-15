
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


import { 
  Package, Check, X, ArrowUpDown, Pencil, Trash2, Plus
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  sortField: keyof Product;
  onSort: (field: keyof Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAddProduct: () => void;
}

const ProductsTable = ({
  products,
  isLoading,
  sortField,
  onSort,
  onEdit,
  onDelete,
  onAddProduct
}: ProductsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead
              className="w-[300px] cursor-pointer"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center">
                Produto
                {sortField === "name" && (
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSort("price")}
            >
              <div className="flex items-center">
                Preço
                {sortField === "price" && (
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSort("createdAt")}
            >
              <div className="flex items-center">
                Criado em
                {sortField === "createdAt" && (
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                <div className="flex flex-col items-center gap-3">
                  <Package className="h-10 w-10 text-gray-300" />
                  <p className="text-gray-500">
                    Nenhum produto cadastrado ainda
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddProduct}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar primeiro produto
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-purple-100 flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/100x100?text=Imagem+não+disponível';
                          }}
                        />
                      ) : (
                        <Package className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[250px]">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-4 w-4 text-green-600 mr-1" />
                    {formatCurrency(product.price)}
                  </div>
                </TableCell>
                <TableCell>
                  {product.isActive ? (
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      Ativo
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <X className="h-4 w-4 mr-1" />
                      Inativo
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(product.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onDelete(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;

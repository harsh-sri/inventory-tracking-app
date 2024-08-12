interface IProductAvailability {
  availability: number;
}

export interface IProductStock extends IProductAvailability {
  productId: string;
  warehouseId: string;
  createdAt?: Date;
  updatedAt: Date;
}

export interface IProductStockResponse extends IProductAvailability {}

export interface IValidStockResponse extends IProductAvailability {
  isPartialStock: boolean;
}

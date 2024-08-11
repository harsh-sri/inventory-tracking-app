import { IDocOptions } from "./interfaces/doc-options.interface";

export const apiDescription = "Inventory Tracker Service";
export const apiTitle = "Inventory Tracker Service";

export const healthTags = ["Health"];

export const updateStockTags = ["Update Stock"];

export const healthCheck: IDocOptions = {
  tagGroupName: "Health Check",
  tags: healthTags,
};

export const stock: IDocOptions = {
  tagGroupName: "Stock Management",
  tags: updateStockTags,
};

export const xTagGroups = [
  {
    name: healthCheck.tagGroupName,
    tags: healthCheck.tags,
  },

  {
    name: stock.tagGroupName,
    tags: stock.tags,
  },
];

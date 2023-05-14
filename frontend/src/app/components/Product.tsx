import React from "react";
import { useListProducts } from "../Hooks/product/product.hooks";

export const Product = () => {
  const response = useListProducts();
  return <div className="grid gap-4 grid-cols-3 overflow-auto">

  </div>;
};

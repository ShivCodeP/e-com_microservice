import React, { useMemo } from "react";
import { useListProducts } from "../Hooks/product/product.hooks";
import { CircularProgress } from "@mui/material";
import { ProductCard } from "./ProductCard";

export const Product = () => {
  const { data, isLoading } = useListProducts();
  const products = useMemo(() => data?.data?.products, [data]);
  return (
    <div className="grid gap-4 grid-cols-3 overflow-auto">
      {!isLoading ? (
        products?.map((each) => <ProductCard key={each._id} {...each} />)
      ) : (
        <CircularProgress size={30} />
      )}
    </div>
  );
};

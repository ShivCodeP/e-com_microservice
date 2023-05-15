import React, { useMemo } from "react";
import { useListOrder } from "../Hooks/order/order.hooks";
import { OrderCard } from "./OrderCard";
import { CircularProgress } from "@mui/material";

export const Order = () => {
  const { data, isLoading } = useListOrder();
  const orders = useMemo(() => data?.data?.orders, [data]);
  return (
    <div className="flex flex-col gap-8 overflow-auto">
      {!isLoading ? (
        orders?.map((each) => <OrderCard key={each._id} {...each} />)
      ) : (
        <CircularProgress size={30} />
      )}
    </div>
  );
};

import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { useAuthInfo } from "../auth/auth.hooks";
import { enqueueSnackbar } from "notistack";

export function useListOrder() {
  const auth = useAuthInfo();
  if (!auth.authenticated)
    throw enqueueSnackbar({ message: "Not Authorized!" });

  return useQuery<
    AxiosResponse<{
      orders: {
        _id: string;
        products: {
          title?: string;
          price?: number;
          rating?: number;
          description?: string;
          images?: string[];
        }[];
        totalPrice?: number;
        status?: string;
      }[];
    }>,
    Error
  >(
    ["list_order"],
    () =>
      axios.get("http://localhost:5000/shop/listorder", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }),
    {
      onError: (err) => {
        enqueueSnackbar({
          message: err.message || "Something went wrong!",
          variant: "error",
        });
      },
    }
  );
}

export function useBuyProduct() {
  const auth = useAuthInfo();
  if (!auth.authenticated)
    throw enqueueSnackbar({ message: "Not Authorized!" });

  return useMutation<
    AxiosResponse<{ message: string }>,
    Error,
    { payload: { _id: string } }
  >(
    ({ payload }) =>
      axios.post("http://localhost:5000/shop/buyProduct", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }),
    {
      onSuccess: (res) => {
        enqueueSnackbar({ message: res.data?.message, variant: "success" });
      },
    }
  );
}

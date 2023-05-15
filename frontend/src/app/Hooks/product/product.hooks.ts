import { useMutation, useQuery } from "react-query";
import axios, { AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { useAuthInfo } from "../auth/auth.hooks";

export function useListProducts() {
  const auth = useAuthInfo();
  if (!auth.authenticated)
    throw enqueueSnackbar({ message: "Not Authorized!" });

  return useQuery<
    AxiosResponse<{
      products: {
        _id: string;
        title?: string;
        price?: number;
        rating?: number;
        description?: string;
        images?: string[];
      }[];
    }>,
    Error
  >(
    ["products"],
    () =>
      axios.get("http://localhost:5000/shop/list", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }),
    {
      staleTime: 5 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
      onError: (err) => {
        enqueueSnackbar({ message: err.message });
      },
    }
  );
}

export function useAddToCart() {
  const auth = useAuthInfo();
  if (!auth.authenticated)
    throw enqueueSnackbar({ message: "Not Authorized!" });

  return useMutation<
    AxiosResponse<{ message: string }>,
    Error,
    { payload: { _id: string } }
  >(
    ({ payload }) =>
      axios.post("http://localhost:5000/shop/addtocart", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }),
    {
      onSuccess: (res) => {
        enqueueSnackbar({ message: res.data?.message, variant: "success" });
      },
      onError: (err) => {
        enqueueSnackbar({ message: err?.message, variant: "error" });
      },
    }
  );
}

import { useQuery } from "react-query";
import axios, { AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { useAuthInfo } from "../auth/auth.hooks";

export function useListProducts() {
  const auth = useAuthInfo();
  if (!auth.authenticated)
    throw enqueueSnackbar({ message: "Not Authorized to action products!" }); 
    
  console.log(auth);
  return useQuery<AxiosResponse<{ products: Record<string, string>[] }>, Error>(
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

import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useMutation } from "react-query";
import axios, { AxiosResponse } from "axios";

export * from "./AuthContext";

export function useAuthInfo() {
  return useContext(AuthContext);
}

export function useLogin() {
  const auth = useAuthInfo();

  if (auth.authenticated) throw new Error("Invalid call!");

  return useMutation<
    AxiosResponse<{ token: string }>,
    Error,
    { payload: { email: string; password: string }; rememberMe: boolean }
  >(
    ({ payload }) =>
      axios.post("http://localhost:4000/auth/login", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    {
      onSuccess: (res, { rememberMe }) =>
        auth.login(res.data?.token, rememberMe),
    }
  );
}

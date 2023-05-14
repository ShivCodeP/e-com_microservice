"use client";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { StrictMode, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Hooks/auth/AuthContext";
import App from "./App/App";

export default function Home() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
        onError: (err) => {
          if (err instanceof Error) {
            enqueueSnackbar(err?.message || "Something went wrong!", {
              variant: "error",
            });
          }
        },
      },
      queries: {
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  const DEV = true;
  return (
    <StrictMode>
      <SnackbarProvider
        preventDuplicate
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Suspense>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AuthProvider>
                <App />
                {DEV && (
                  <ReactQueryDevtools
                    initialIsOpen={false}
                    position="bottom-right"
                  />
                )}
              </AuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </Suspense>
      </SnackbarProvider>
    </StrictMode>
  );
}

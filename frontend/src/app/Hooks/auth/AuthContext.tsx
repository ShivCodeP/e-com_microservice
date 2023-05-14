import React, { memo, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

type AuthContextType =
  | {
      authenticated: false;
      check: () => void;
      login: (token: string, remember: boolean) => void;
    }
  | {
      authenticated: true;
      token: string;
      logOut: () => void;
      check: () => void;
    };

export const AuthContext = React.createContext<AuthContextType>({
  authenticated: false,
  check: () => null,
  login: () => null,
});

type AuthProviderProps = { children: React.ReactNode | React.ReactNode[] };

function _AuthProvider(props: AuthProviderProps) {
  const [token, setToken] = useState(localStorage.getItem("token_sarva") || "");
  const qc = useQueryClient();
  const navigate = useNavigate();

  const ctxValue = useMemo((): AuthContextType => {
    const check = () =>
      !token && setToken(localStorage?.getItem("token_sarva") || "");

    if (!token) {
      return {
        authenticated: false,
        check,
        login: (token, remember) => {
            console.log(token);
          if (remember) localStorage?.setItem("token_sarva", token);
          setToken(token);
        },
      };
    }
    return {
      authenticated: true,
      token,
      check,
      logOut: () => {
        qc.clear();
        setToken("");
        localStorage?.removeItem("token_sarva");
        navigate("/login");
      },
    };
  }, [qc, token]);

  return (
    <AuthContext.Provider value={ctxValue}>
      {props.children}
    </AuthContext.Provider>
  );
}

export const AuthProvider = memo(_AuthProvider);

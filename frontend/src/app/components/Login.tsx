import Image from "next/image";
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import {
  Visibility as ShowPasswordIcon,
  VisibilityOff as HidePasswordIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useLogin } from "../Hooks/auth/auth.hooks";
import { useState } from "react";
import { useForm } from "react-hook-form-v7";
import { validateEmail } from "../utils/validator";

export function Login() {
  const { mutate: login, isLoading: loggingIn } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState } = useForm({
    mode: "onBlur",
    defaultValues: { password: "", email: "", rememberMe: true },
  });

  const onSubmit: Parameters<typeof handleSubmit>[0] = ({
    rememberMe,
    ...payload
  }) => login({ payload, rememberMe });

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        noValidate
        className="p-4 max-w-md text-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Image
          src="https://www.sarva.ai/images/revamp/sarva-logo.svg"
          className="mx-auto mb-8"
          alt="sarva_ecom"
          width={100}
          height={100}
        />
        <InputLabel htmlFor="email" required>
          Email
        </InputLabel>
        <TextField
          required
          fullWidth
          type="email"
          name="email"
          size="small"
          className="mb-4"
          placeholder="Enter Email ID *"
          error={!!formState.errors?.email}
          InputProps={{ className: "bg-white" }}
          helperText={formState.errors?.email?.message?.toString() || ""}
          inputProps={register("email", {
            required: "* Required",
            validate: validateEmail,
          })}
        />
        <InputLabel htmlFor="password" required>
          Password
        </InputLabel>
        <TextField
          required
          fullWidth
          size="small"
          name="password"
          className="mb-4"
          color="primary"
          placeholder="Enter Password *"
          error={!!formState.errors?.password}
          type={showPassword ? "text" : "password"}
          helperText={formState.errors?.password?.message?.toString() || ""}
          inputProps={register("password", {
            required: "* Required",
            minLength: { message: "Too short", value: 8 },
          })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  size="small"
                  color="primary"
                >
                  {showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon />}
                </IconButton>
              </InputAdornment>
            ),
            className: "bg-white",
          }}
        />
        <div className="flex items-center justify-between mb-4">
          <FormControlLabel
            label="Remember Me"
            control={<Checkbox {...register("rememberMe")} defaultChecked />}
          />
          <Link to="/forgot-password" className="underline">
            Forgot Password?
          </Link>
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={loggingIn}
        >
          {loggingIn ? "Logging in" : "Login"}
        </Button>
      </form>
    </div>
  );
}

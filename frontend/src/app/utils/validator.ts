import { Message, ValidateResult } from "react-hook-form-v7";

type ValidateResultNew = Exclude<ValidateResult, Message[]>;

export function validateEmail(data: string): ValidateResultNew {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return re.test(data) || "Invalid email";
}

import {DateField, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Controller} from "react-hook-form";
import {FormInputProps} from "./formInputProps.ts";

export const InputDate = ({ name, control, label }: FormInputProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DateField value={value} onChange={onChange} label={label} format="DD/MM/YYYY"/>
        )}
      />
    </LocalizationProvider>
  );
};
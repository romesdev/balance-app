import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./formInputProps";
const options = [
  {
    label: "Crédito",
    value: "c",
  },
  {
    label: "Débito",
    value: "d",
  },
];
export const FormInputRadio: React.FC<FormInputProps> = ({
                                                           name,
                                                           control,
                                                           label,
                                                         }) => {
  const generateRadioOptions = () => {
    return options.map((singleOption) => (
      <FormControlLabel
        value={singleOption.value}
        label={singleOption.label}
        control={<Radio />}
      />
    ));
  };
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({
                   field: { onChange, value },
                 }) => (
          <RadioGroup value={value} onChange={onChange}>
            {generateRadioOptions()}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};
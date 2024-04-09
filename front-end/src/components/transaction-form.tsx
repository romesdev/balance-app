import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {InputDate} from "./input-date.tsx";
import {InputLabel, MenuItem, Select} from "@mui/material";

interface ITransactionInput {
  accountId: number;
  description: string;
  value: number;
  type: string;
  date: Date
}

export default function TransactionForm() {
  const schema = yup.object().shape({
    description: yup
      .string()
      .required("O nome da conta é obrigatório"),
    value: yup
      .number()
      .required("O saldo inicial é obrigatório")
      .min(0.01,'O valor deve ser positivo'),
    type: yup.string().required('O tipo do lançamento é obrigatório'),
    date: yup.date().required('A data é obrigatória'),
    accountId: yup.number().required('A conta é obrigatória'),
  });

  const { register, handleSubmit, control, formState: { errors}, }= useForm<ITransactionInput>({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  });

  const onSubmit: SubmitHandler<ITransactionInput> = (data: ITransactionInput, event) => {
    // @ts-ignore
    event?.preventDefault()

    console.log(JSON.stringify(data))

    fetch('http://localhost:3000/transactions/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(res => console.log(res.json()))
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error = {!!errors?.description}
          label = "Descrição"
          helperText = { errors?.description ? errors?.description.message : "" }
          {...register("description")}
        />
        <TextField
          error = {!!errors?.value}
          label = "Valor"
          helperText = { errors.value ? errors.value.message : "" }
          {...register("value")}
        />

        <InputLabel id="type">Tipo</InputLabel>
        <Select
          labelId="type-select"
          id="type-select"
          label="Tipo"
          {...register('type')}
          error={!!errors?.type}
        >
          <MenuItem value={"c"}>Crédito</MenuItem>
          <MenuItem value={"d"}>Débito</MenuItem>
        </Select>

        <TextField
          error = {!!errors?.accountId}
          label = "Conta"
          helperText = { errors.accountId ? errors.accountId.message : "" }
          {...register("accountId")}
        />

        <InputDate name="date" control={control} label="Data" />


        <Button color="primary" type = "submit" variant = "contained">
          Salvar
        </Button>
      </form>
    </>
  );
}
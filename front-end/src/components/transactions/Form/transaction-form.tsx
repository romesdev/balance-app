import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputDate } from "../../input-date.tsx";
import {
  Box,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { ArrowBack } from "@mui/icons-material";

interface ITransactionInput {
  description: string;
  value: number;
  type: string;
  date: Date;
}

export default function TransactionForm() {
  const { id, accountId } = useParams();
  const navigate = useNavigate();
  const { state: transactionData } = useLocation();

  const schema = yup.object().shape({
    description: yup
      .string()
      .required("O campo obrigatório")
      .min(5, "O campo deve conter no mínimo 5 caracteres")
      .max(150, "O campo deve conter no máximo 150 caracteres"),
    value: yup
      .number()
      .typeError("O campo deve conter um valor numérico")
      .required("O campo é obrigatório")
      .min(0.01, "O campo deve conter um valor positivo"),
    type: yup.string().required("O campo é obrigatório"),
    date: yup
      .date()
      .required("O campo é obrigatório")
      .max(new Date(), "O campo não pode conter uma data futura"),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ITransactionInput>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<ITransactionInput> = (
    data: ITransactionInput,
    event
  ) => {
    // @ts-ignore
    event?.preventDefault();

    if (id) {
      fetch(`http://localhost:3000/transactions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...data, accountId }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then(() => navigate(`/accounts/${accountId}/transactions`));
    } else {
      fetch("http://localhost:3000/transactions/", {
        method: "POST",
        body: JSON.stringify({ ...data, accountId }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then(() => navigate(`/accounts/${accountId}/transactions`));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          gap={2}
          width="50%"
          mx={"auto"}
        >
          <Stack
            display="flex"
            direction="row"
            justifyContent="space-start"
            spacing={12}
            mt={2}
          >
            <IconButton
              ml={0}
              color="terciary"
              aria-label="back button"
              onClick={() => navigate(`/accounts/${accountId}/transactions`)}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="h6" center>
              Cadastrar lançamento
            </Typography>
            <Button color="primary" type="submit" variant="contained">
              Salvar
            </Button>
          </Stack>
          <TextField
            error={!!errors?.description}
            label="Descrição"
            defaultValue={transactionData?.description ?? ""}
            helperText={errors?.description ? errors?.description.message : ""}
            {...register("description")}
            fullWidth
          />
          <TextField
            error={!!errors?.value}
            label="Valor"
            helperText={errors.value ? errors.value.message : ""}
            defaultValue={transactionData?.value ?? ""}
            {...register("value")}
            fullWidth
          />

          <Box
            display={"flex"}
            flexDirection={"row"}
            gap={2}
            sx={{ justifyContent: "space-between" }}
            fullWidth
          >
            <Box>
              <Box>
                <InputLabel id="type">Tipo</InputLabel>
                <Select
                  labelId="type-select"
                  id="type-select"
                  label="Tipo"
                  defaultValue={transactionData?.type ?? "c"}
                  {...register("type")}
                  error={!!errors?.type}
                  fullWidth
                >
                  <MenuItem value={"c"}>Crédito</MenuItem>
                  <MenuItem value={"d"}>Débito</MenuItem>
                </Select>
              </Box>
            </Box>

            <Box fullWidth>
              <InputLabel id="date-label">Data</InputLabel>
              <InputDate
                name="date"
                error={!!errors?.date}
                helperText={errors?.date ? errors?.date?.message : ""}
                control={control}
                defaultValue={dayjs(transactionData?.date)}
              />
            </Box>
          </Box>
        </Box>
      </form>
    </>
  );
}

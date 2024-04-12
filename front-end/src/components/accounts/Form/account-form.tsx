import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, IconButton, Typography, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

interface IFormInput {
  name: string;
  openingBalance: number;
}

export default function AccountForm() {
  const { id: accountId } = useParams();
  const navigate = useNavigate();
  const { state: accountData } = useLocation();

  const schema = yup.object().shape({
    name: yup.string().required("O nome da conta é obrigatório"),
    openingBalance: yup
      .number()
      .required("O saldo inicial é obrigatório")
      .min(0.01, "O valor deve ser positivo"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput, event) => {
    // @ts-ignore
    event?.preventDefault();

    if (accountId) {
      fetch(`http://localhost:3000/accounts/${accountId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then(() => navigate("/accounts"));
    } else {
      fetch("http://localhost:3000/accounts/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then(() => navigate("/accounts"));
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
              onClick={() => navigate(`/accounts/`)}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="h6" center>
              Cadastrar conta
            </Typography>
            <Button color="primary" type="submit" variant="contained">
              Salvar
            </Button>
          </Stack>
          <TextField
            error={!!errors?.name}
            label="Nome"
            helperText={errors?.name ? errors?.name.message : ""}
            defaultValue={accountData?.name ? accountData?.name : ""}
            {...register("name")}
            fullWidth
          />
          <TextField
            error={!!errors?.openingBalance}
            label="Saldo inicial"
            helperText={
              errors.openingBalance ? errors.openingBalance.message : ""
            }
            defaultValue={
              accountData?.openingBalance ? accountData?.openingBalance : 0
            }
            {...register("openingBalance")}
            fullWidth
          />
        </Box>
      </form>
    </>
  );
}

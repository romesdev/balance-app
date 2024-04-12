import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Box, Typography} from "@mui/material";

interface IFormInput {
    name: string;
    openingBalance: number;
}

export default function AccountForm() {
    const { id: accountId } = useParams();
    const navigate = useNavigate()
    const {state: accountData} = useLocation()


    const schema = yup.object().shape({
        name: yup
          .string()
          .required("O nome da conta é obrigatório"),
        openingBalance: yup
          .number()
          .required("O saldo inicial é obrigatório")
          .min(0.01,'O valor deve ser positivo'),
    });

    const { register, handleSubmit,formState: { errors}, }= useForm<IFormInput>({
        resolver: yupResolver(schema),
        mode: 'onBlur'
    });

    const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput, event) => {
        // @ts-ignore
        event?.preventDefault()

        if (accountId) {
            fetch(`http://localhost:3000/accounts/${accountId}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
              .then(() => navigate('/accounts'))
        } else {
        fetch('http://localhost:3000/accounts/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
          .then(() => navigate('/accounts'))
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box  display="flex"
                      alignItems="center"
                      flexDirection="column"
                      gap={2}
                      width="50%"
                      mx={'auto'}
                >
                <Typography variant="h3" component="h3" center>
                    Conta contábil
                </Typography>
                <TextField
                    error = {!!errors?.name}
                    label = "Nome"
                    helperText = { errors?.name ? errors?.name.message : "" }
                    defaultValue={accountData?.name ? accountData?.name : ""}
                    {...register("name")}
                    fullWidth
                />
                <TextField
                    error = {!!errors?.openingBalance}
                    label = "Saldo inicial"
                    helperText = { errors.openingBalance ? errors.openingBalance.message : "" }
                    defaultValue={accountData?.openingBalance ? accountData?.openingBalance : 0}
                    {...register("openingBalance")}
                  fullWidth
                />

                <Button color="primary" type = "submit" variant = "contained" fullWidth>
                    Salvar
                </Button>
            </Box>
            </form>
        </>
    );
}
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface IFormInput {
    name: string;
    openingBalance: number;
}

export default function AccountForm() {
    const schema = yup.object().shape({
        name: yup
          .string()
          .required("O nome da conta é obrigatório"),
        openingBalance: yup
          .number()
          .required("O saldo inicial é obrigatório")
          .min(0.05,'O valor deve ser positivo'),
    });

    const { register, handleSubmit,formState: { errors}, }= useForm<IFormInput>({
        resolver: yupResolver(schema),
        mode: 'onBlur'
    });

    const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput, event) => {
        // @ts-ignore
        event?.preventDefault()

        console.log(JSON.stringify(data))

        fetch('http://localhost:3000/accounts/', {
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
                    error = {!!errors?.name}
                    label = "Nome"
                    helperText = { errors?.name ? errors?.name.message : "" }
                    {...register("name")}
                />
                <TextField
                    error = {!!errors?.openingBalance}
                    label = "Saldo inicial"
                    helperText = { errors.openingBalance ? errors.openingBalance.message : "" }
                    {...register("openingBalance")}
                />

                <Button color="primary" type = "submit" variant = "contained">
                    Submit
                </Button>
            </form>
        </>
    );
}
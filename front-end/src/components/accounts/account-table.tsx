import * as React from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridDeleteIcon,
  GridRowId,
} from "@mui/x-data-grid";
import { useEffect, useState, useMemo, useCallback } from "react";
import SubjectIcon from "@mui/icons-material/Subject";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { Stack, Box, Typography, Button } from "@mui/material";

type AccountsTableColumns = {
  id: number;
  name: string;
  openingBalance: number;
  balance: number;
};

export default function AccountDataTable() {
  const [accounts, setAccounts] = useState<AccountsTableColumns[]>([]);
  const navigate = useNavigate();

  const deleteAccount = useCallback(
    (id: GridRowId) => () => {
      fetch(`http://localhost:3000/accounts/${id}`, {
        method: "DELETE",
      }).then(() =>
        setTimeout(() => {
          setAccounts((prevRows) => prevRows.filter((row) => row.id !== id));
        })
      );
    },
    []
  );

  const columns = useMemo<GridColDef<AccountsTableColumns>[]>(
    () => [
      {
        field: "id",
        align: "center",
        headerName: "ID",
        headerAlign: "center",
        minWidth: 150,
      },
      {
        field: "name",
        headerName: "Nome",
        headerAlign: "center",
        minWidth: 150,
        align: "center",
      },
      {
        field: "balance",
        headerName: "Saldo atual",
        type: "number",
        headerAlign: "center",
        minWidth: 150,
        align: "center",
      },
      {
        field: "openingBalance",
        headerName: "Saldo inicial",
        type: "number",
        headerAlign: "center",
        minWidth: 150,
        align: "center",
      },
      {
        field: "actions",
        type: "actions",
        align: "center",
        maxWidth: 50,
        getActions: (params) => {
          return [
            <GridActionsCellItem
              icon={<SubjectIcon />}
              label="Ver lançamentos"
              showInMenu
              onClick={() => navigate(`/accounts/${params.id}/transactions`)}
            />,
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Editar"
              showInMenu
              onClick={() =>
                navigate(`/accounts/register/${params.id}`, {
                  state: params.row,
                })
              }
            />,
            <GridActionsCellItem
              icon={<GridDeleteIcon />}
              label="Delete"
              showInMenu
              onClick={deleteAccount(params.id)}
            />,
          ];
        },
      },
    ],
    [deleteAccount, navigate]
  );

  useEffect(() => {
    fetch("http://localhost:3000/accounts/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setAccounts(res));
  }, []);

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      gap={4}
      width="75%"
      mx={"auto"}
      height={400}
    >
      <Stack
        display="flex"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={12}
        mt={2}
      >
        <Typography variant="h6" component="h6" center>
          Contas contábeis
        </Typography>
        <Button
          color="primary"
          type="submit"
          variant="contained"
          onClick={() => navigate(`/accounts/register`)}
        >
          Cadastrar
        </Button>
      </Stack>
      <DataGrid
        rows={accounts}
        columns={columns}
        disableColumnMenu
        hideFooter
        localeText={{ noRowsLabel: "Sem registros" }}
      />
    </Box>
  );
}

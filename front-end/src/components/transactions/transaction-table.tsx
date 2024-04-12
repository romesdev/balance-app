import * as React from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridDeleteIcon,
  GridRowId,
} from "@mui/x-data-grid";
import { useEffect, useState, useMemo, useCallback } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Stack, Box, Typography, Button, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

type TransactionsTableColumns = {
  id: number;
  description: string;
  type: number;
  value: number;
  date: Date;
};

export default function TransactionsDataTable() {
  const [transactions, setTransactions] = useState<TransactionsTableColumns[]>(
    []
  );
  const navigate = useNavigate();
  const { id: accountId } = useParams();

  const deleteTransaction = useCallback(
    (id: GridRowId) => () => {
      fetch(`http://localhost:3000/transactions/${id}`, {
        method: "DELETE",
      }).then(() =>
        setTimeout(() => {
          setTransactions((prevRows) =>
            prevRows.filter((row) => row.id !== id)
          );
        })
      );
    },
    []
  );

  const columns = useMemo<GridColDef<TransactionsTableColumns>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        display: "flex",
        headerAlign: "center",
        align: "center",
      },
      {
        field: "description",
        headerName: "Descrição",
        headerAlign: "center",
        align: "center",
        minWidth: 250,
      },
      { field: "value", headerName: "Valor", align: "center" },
      {
        field: "type",
        headerName: "Tipo",
        display: "flex",
        headerAlign: "center",
        align: "center",
        type: "string",
        valueFormatter: (value) => (value === "c" ? "Crédito" : "Débito"),
      },
      {
        field: "date",
        headerName: "Data",
        type: "date",
        headerAlign: "center",
        align: "center",
        minWidth: 150,
        display: "flex",
        valueFormatter: (value) => dayjs(value).format("DD/MM/YYYY"),
      },
      {
        field: "actions",
        type: "actions",
        display: "flex",
        getActions: (params) => {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Editar"
              showInMenu
              onClick={() =>
                navigate(
                  `/accounts/${accountId}/transactions/register/${params.id}`,
                  { state: params.row }
                )
              }
            />,
            <GridActionsCellItem
              icon={<GridDeleteIcon />}
              label="Delete"
              showInMenu
              onClick={deleteTransaction(params.id)}
            />,
          ];
        },
      },
    ],
    [deleteTransaction, accountId, navigate]
  );

  useEffect(() => {
    fetch(`http://localhost:3000/transactions/account/${accountId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setTransactions(res));
  }, [accountId]);

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
        <IconButton
          color="terciary"
          aria-label="back button"
          onClick={() => navigate(`/accounts/`)}
        >
          <ArrowBack />
        </IconButton>

        <Typography variant="h6" component="h6" center>
          Lançamentos contábeis
        </Typography>

        <Button
          color="primary"
          type="submit"
          variant="contained"
          onClick={() =>
            navigate(`/accounts/${accountId}/transactions/register`)
          }
        >
          Cadastrar
        </Button>
      </Stack>

      <DataGrid
        rows={transactions}
        columns={columns}
        disableColumnMenu
        hideFooter
        localeText={{ noRowsLabel: "Sem registros" }}
      />
    </Box>
  );
}

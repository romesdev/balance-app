import * as React from 'react';
import {DataGrid, GridActionsCellItem, GridColDef, GridDeleteIcon, GridRowId} from '@mui/x-data-grid';
import {useEffect, useState, useMemo, useCallback} from "react";
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate, useParams} from "react-router-dom";
import dayjs from 'dayjs'
import Button from "@mui/material/Button";

type TransactionsTableColumns = {
  id: number,
  description: string,
  type: number,
  value: number,
  date: Date,
}


export default function TransactionsDataTable() {
  const [transactions, setTransactions] = useState<TransactionsTableColumns[]>([])
  const navigate = useNavigate();
  const {id: accountId } = useParams()


  const deleteTransaction = useCallback(
    (id: GridRowId) => () => {
      fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'DELETE',
      })
        .then(() => setTimeout(() => {
          setTransactions((prevRows) => prevRows.filter((row) => row.id !== id));
        }))
    },
    [],
  );

  const columns =  useMemo<GridColDef<TransactionsTableColumns>[]>(()=> [
    { field: 'id', headerName: 'ID', display: 'flex' },
    { field: 'description', headerName: 'Descrição',maxWidth: 250, minWidth:150, display: 'flex' },
    { field: 'value', headerName: 'Valor', display: 'flex' },
    { field: 'type', headerName: 'Tipo', display: 'flex', type: 'string',
      valueFormatter: ( value) => value === 'c' ? 'Crédito' : 'Débito'},
    {
      field: 'date',
      headerName: 'Data',
      type: 'date',
      display: 'flex',
      valueFormatter: (value) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      field: 'actions',
      type: 'actions',
      display: 'flex',
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon/>}
            label="Editar"
            showInMenu
            onClick={() => navigate(`/accounts/${accountId}/transactions/register/${params.id}`, {state: params.row})}
          />,
          <GridActionsCellItem
            icon={<GridDeleteIcon/>}
            label="Delete"
            showInMenu
            onClick={deleteTransaction(params.id)}
          />,
        ]
      },
    }
  ], [deleteTransaction, accountId, navigate])


  useEffect(() => {
    fetch(`http://localhost:3000/transactions/account/${accountId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(res => setTransactions(res))
  }, [accountId])


  return (
    <div style={{ height: 400, width: '100%' }}>
      <Button
        onClick={() => navigate(`/accounts/${accountId}/transactions/register`)}
      >Cadastrar</Button>
      <DataGrid
        rows={transactions}
        columns={columns}
        disableColumnMenu
        hideFooter
      />
    </div>
  );
}
import * as React from 'react';
import {DataGrid, GridActionsCellItem, GridColDef, GridDeleteIcon, GridRowId} from '@mui/x-data-grid';
import {useEffect, useState, useMemo, useCallback} from "react";
import SubjectIcon from '@mui/icons-material/Subject';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";

type AccountsTableColumns = {
  id: number,
  name: string,
  openingBalance: number,
  balance: number,
}


export default function AccountDataTable() {
  const [accounts, setAccounts] = useState<AccountsTableColumns[]>([])
  const navigate = useNavigate();


  const deleteAccount = useCallback(
    (id: GridRowId) => () => {
      fetch(`http://localhost:3000/accounts/${id}`, {
        method: 'DELETE',
      })
        .then(() => setTimeout(() => {
          setAccounts((prevRows) => prevRows.filter((row) => row.id !== id));
        }))
    },
    [],
  );

  const columns =  useMemo<GridColDef<AccountsTableColumns>[]>(()=> [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome', width: 130 },
    { field: 'balance', headerName: 'Saldo atual', width: 130, type: 'number' },
    {
      field: 'openingBalance',
      headerName: 'Saldo inicial',
      type: 'number',
      width: 90,
    },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<SubjectIcon/>}
            label="Ver lançamentos"
            showInMenu
            onClick={() => navigate(`/accounts/${params.id}/transactions`)}
          />,
          <GridActionsCellItem
            icon={<EditIcon/>}
            label="Editar"
            showInMenu
            onClick={() => navigate(`/accounts/register/${params.id}`, {state: params.row})}
          />,
          <GridActionsCellItem
            icon={<GridDeleteIcon/>}
            label="Delete"
            showInMenu
            onClick={deleteAccount(params.id)}
          />,
        ]
      },
    }
  ], [deleteAccount, navigate])




  useEffect(() => {
    fetch('http://localhost:3000/accounts/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(res => setAccounts(res))
  }, [])


  return (
    <div style={{ height: 400, width: '100%' }}>
      <Button
        onClick={() => navigate(`/accounts/register`)}
      >Cadastrar</Button>
      <DataGrid
        rows={accounts}
        columns={columns}
        disableColumnMenu
        hideFooter
      />
    </div>
  );
}
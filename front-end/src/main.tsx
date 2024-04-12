import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import AccountDataTable from "./components/accounts/account-table.tsx";
import AccountForm from "./components/accounts/Form/account-form.tsx";
import TransactionForm from "./components/transactions/Form/transaction-form.tsx";
import TransactionsDataTable from "./components/transactions/transaction-table.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/accounts",
    element: <AccountDataTable/>,
  },
  {
    path: "/accounts/register",
    element: <AccountForm/>,
  },
  {
    path: "/accounts/register/:id",
    element: <AccountForm/>,
  },
  {
    path: "accounts/:id/transactions",
    element: <TransactionsDataTable/>,
  },
  {
    path: "accounts/:accountId/transactions/register/",
    element: <TransactionForm/>,
  },
  {
    path: "accounts/:accountId/transactions/register/:id",
    element: <TransactionForm/>,
  },
] );

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

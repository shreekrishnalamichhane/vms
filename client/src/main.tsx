import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { ApiProvider } from "@reduxjs/toolkit/query/react"
import { authSlice } from './features/api/authSlice'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApiProvider api={authSlice}>
      <App />
    </ApiProvider>
  </React.StrictMode>
)

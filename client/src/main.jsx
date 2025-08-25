import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DataProvider from "./context/DataProvider.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    
  <DataProvider.DataProvider>
    <App />
    </DataProvider.DataProvider>
  </StrictMode>,
)

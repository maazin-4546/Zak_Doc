import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { DashboardContextProvider } from './Context/DashboardContext.jsx';
import { InvoiceTableContextProvider } from './Context/InvoiceTableContext.jsx';
import { NavbarContextProvider } from './Context/NavbarContext.jsx';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <NavbarContextProvider>
      <DashboardContextProvider>
        <InvoiceTableContextProvider>
          <App />
        </InvoiceTableContextProvider>
      </DashboardContextProvider>
    </NavbarContextProvider>
  </BrowserRouter>
);

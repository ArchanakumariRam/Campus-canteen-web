import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdminPortal } from './components/admin/AdminPortal';
import './styles/theme.css';

ReactDOM.createRoot(document.getElementById('admin-root')).render(
  <React.StrictMode>
    <AdminPortal />
  </React.StrictMode>
);

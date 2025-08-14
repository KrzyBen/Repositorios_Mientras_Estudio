import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
//importe de cupones
import Cupones from '@pages/Coupons';
import CuponesAdmin from '@pages/CouponsAdmin';
import CuponesVecinoAdmin from '@pages/CuponesPorVecino';

//------------------
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <Error404/>,
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/users',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <Users />
        </ProtectedRoute>
        ),
    },
    {
      path: '/cupones',
      element: (
        <ProtectedRoute allowedRoles={['vecino']}>
          <Cupones />
        </ProtectedRoute>
      )
    },
    {
      path: '/cupones-admin',
      element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <CuponesAdmin />
        </ProtectedRoute>
      )
    },
    {
      path: '/cupones-admin/vecino/:vecinoId',
      element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <CuponesVecinoAdmin />
        </ProtectedRoute>
      )
    }/*,
    {
      path: '/cupones-encargado',
      element: (
        <ProtectedRoute allowedRoles={['encargado_P']}>
          <CuponesEncargado />
        </ProtectedRoute>
      )
    }*/
    ]
  },
  {
    path: '/auth',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"

import App from './App.jsx'
import Diretrizes from './pages/diretrizes.jsx'
import Sobre from './pages/sobre.jsx'
import Registro from './pages/registro.jsx'
import Equipe from './pages/equipe.jsx'
import Topicos from './pages/topicos.jsx'
import Login from './pages/login.jsx';
import Profile from './pages/perfil.jsx'

const router = createBrowserRouter([
  {path:"/", element:<App/>},
  {path:"/diretrizes", element:<Diretrizes/>},
  {path:"/sobre", element:<Sobre/>},
  {path:"/registro", element:<Registro/>},
  {path:"/equipe", element:<Equipe/>},
  {path:"/topicos",element:<Topicos/>},
  {path: "/login", element: <Login /> },
  {path: "/perfil", element: <Profile /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)

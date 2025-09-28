import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"

import App from './App.jsx'
import Diretrizes from './pages/diretrizes.jsx'
import Sobre from './pages/sobre.jsx'

const router = createBrowserRouter([
  {path:"/", element:<App/>},
  {path:"/diretrizes", element:<Diretrizes/>},
  {path:"/sobre", element:<Sobre/>},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
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
import Internet from './pages/lista_topicos/internet.jsx'
//import Computadores from './pages/lista_topicos/computadores.jsx'
//import Mensagens from './pages/lista_topicos/mensagens.jsx'
import Perfil from './pages/perfil.jsx'
import Configuracoes from './pages/configuracoes.jsx'
import Comunidade from './pages/comunidade.jsx'
import LessonPage from './pages/lista_topicos/lessons/LessonPage.jsx'


const router = createBrowserRouter([
  {path:"/", element:<App/>},
  {path:"/diretrizes", element:<Diretrizes/>},
  {path:"/sobre", element:<Sobre/>},
  {path:"/registro", element:<Registro/>},
  {path:"/equipe", element:<Equipe/>},
  {path:"/topicos",element:<Topicos/>},
  {path:"/login", element:<Login /> },
  {path:"/perfil", element:<Perfil /> },
  {path:"/configuracoes", element:<Configuracoes /> },
  {path:"/cursos/:id", element:<Internet/>}, 
  {path:"/licoes/:lessonId", element:<LessonPage/>}, 
  { path:"/comunidade", element: <Comunidade /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)

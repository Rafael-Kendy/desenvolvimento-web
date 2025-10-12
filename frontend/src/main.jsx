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
import Computadores from './pages/lista_topicos/computadores.jsx'
import Mensagens from './pages/lista_topicos/mensagens.jsx'
import Perfil from './pages/perfil.jsx'
import Configuracoes from './pages/configuracoes.jsx'
import PgRede from "./pages/lista_topicos/lessons/pg_rede.jsx";
import PgComoFunciona from "./pages/lista_topicos/lessons/pg_comofunciona.jsx";
import PgParaQueServe from "./pages/lista_topicos/lessons/pg_paraqueserve.jsx";
import Comunidade from './pages/comunidade.jsx'


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
  {path:"/lista_topicos/internet", element:<Internet/>},
  {path:"/lista_topicos/computadores", element:<Computadores/>},// TODO -- escalabilidade com useParams
  {path:"/lista_topicos/mensagens", element:<Mensagens/>},
  { path:"/lista_topicos/lessons/pg_rede", element: <PgRede /> },
  { path:"/lista_topicos/lessons/pg_comofunciona", element: <PgComoFunciona /> },
  { path:"/lista_topicos/lessons/pg_paraqueserve", element: <PgParaQueServe /> },
  { path:"/comunidade", element: <Comunidade /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)

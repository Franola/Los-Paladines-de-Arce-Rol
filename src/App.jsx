import { useState } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './components/Layout'
import CardContainer from './components/CardsContainer/CardContainer'
import Usuario from './components/Usuario'
import Error from './components/Error'
import Login from './components/Login'
import { UsuarioProvider } from './components/context/usuarioContext';

function App() {

  return (
    <>
      <UsuarioProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout/>}>
              <Route index element={<CardContainer/>}/>
              <Route path=':categoriaParam' element={<CardContainer/>} />
              <Route path='admin/crearUsuario' element={<Usuario/>} />
              <Route path='*' element={<Error/>} />
            </Route>
            <Route path='login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </UsuarioProvider>
    </>
  )
}

export default App

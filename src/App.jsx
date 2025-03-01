import { useState } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './components/Layout'
import CardContainer from './components/CardsContainer/CardContainer'
import Usuario from './components/Usuario'
import OfrecerCartas from './components/OfrecerCartas'
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
              {/* ADMIN */}
              <Route path='admin/crearUsuario' element={<Usuario/>} />
              {/* <Route path='admin/editarUsuario/:id' element={<Usuario/>} />*/}
              <Route path='admin/ofrecerCartas' element={<OfrecerCartas/>} />
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

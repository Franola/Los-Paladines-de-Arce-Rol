import { useState } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './components/Layout'
import CardContainer from './components/CardsContainer/CardContainer'
import Notificaciones from './components/Notificaciones'
import Usuario from './components/Usuario'
import OfrecerCartas from './components/OfrecerCartas'
import Error from './components/Error'
import Login from './components/Login'
import { UsuarioProvider } from './components/context/usuarioContext';
import AdminNotificaciones from './components/AdminNotificaciones';
import Clase from './forms/Clase/Clase.jsx';
import Rama from './forms/Rama/Rama.jsx';
import Hechizo from './forms/Hechizo/Hechizo.jsx';
import Arma from './forms/Arma/Arma.jsx';
import Armadura from './forms/Armadura/Armadura.jsx';
import Pasiva from './forms/Pasiva/Pasiva.jsx';
import Comida from './forms/Comida/Comida.jsx';
import Objeto from './forms/Objeto/Objeto.jsx';

function App() {

  return (
    <>
      <UsuarioProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout/>}>
              <Route index element={<CardContainer/>}/>
              <Route path='cartas/:categoriaParam' element={<CardContainer/>} />
              <Route path='notificaciones' element={<Notificaciones/>} />
              <Route path='/clases' element={<Clase/>} />
              <Route path='/ramas' element={<Rama/>} />
              {/* ADMIN */}
              <Route path='admin/crearUsuario' element={<Usuario/>} />
              {/* <Route path='admin/editarUsuario/:id' element={<Usuario/>} />*/}
              <Route path='admin/ofrecerCartas' element={<OfrecerCartas/>} />
              <Route path='admin/notificaciones' element={<AdminNotificaciones/>} />
              <Route path='admin/hechizos' element={<Hechizo/>} />
              <Route path='admin/armas' element={<Arma/>} />
              <Route path='admin/armaduras' element={<Armadura/>} />
              <Route path='admin/pasivas' element={<Pasiva/>} />
              <Route path='admin/comidas' element={<Comida/>} />
              <Route path='admin/objetos' element={<Objeto/>} />
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

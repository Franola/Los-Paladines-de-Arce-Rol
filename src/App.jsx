import { useState } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './components/Layout'
import CardContainer from './components/CardsContainer/CardContainer'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route index element={<CardContainer/>}/>
            <Route path=':categoria' element={<CardContainer/>} />
            <Route path='*' element={<Error/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

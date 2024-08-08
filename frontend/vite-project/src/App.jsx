import { useState } from 'react'
import './index.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Sender } from './Sender'
import { Receiver } from './Rciever'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Sender></Sender>}></Route>
        <Route path="/sender" element={<Sender />} />
        <Route path="/rec" element={<Receiver />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
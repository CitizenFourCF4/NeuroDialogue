import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routing from "src/pages/index"
import './index.css'

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </div>
  )
}

export default App
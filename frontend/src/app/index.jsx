import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routing from './routes'
import './index.css'
import { Provider } from 'react-redux';
import store from './store/store';

const App = () => {
  return (
    <div className="app">
      <Provider store={store}> 
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </Provider>
      
    </div>
  )
}

export default App
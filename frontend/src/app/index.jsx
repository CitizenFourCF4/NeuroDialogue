import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Routing from './routes';
import store from './store/store';
import './index.css';

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
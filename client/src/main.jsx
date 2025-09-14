
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import  Context from './context/Context.jsx'
import Chatprovider from './context/Chatprovider.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Context>
      <Chatprovider>
        <App />
      </Chatprovider>
    </Context>
  </BrowserRouter>
)

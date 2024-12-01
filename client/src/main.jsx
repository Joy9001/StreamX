import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import App from './App.jsx'
import Auth0ProviderWrapper from './components/Auth/Auth0ProviderWrapper.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <Auth0ProviderWrapper>
        <App />
      </Auth0ProviderWrapper>
    </RecoilRoot>
  </React.StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PrivacyPage from './PrivacyPage.jsx'

const path = window.location.pathname.replace(/\/+$/, '')
const isPrivacyPage = path === '/privacy'

document.title = isPrivacyPage
  ? 'Privacy Policy | FirstStepReading'
  : 'FirstStepReading'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPrivacyPage ? <PrivacyPage /> : <App />}
  </StrictMode>,
)

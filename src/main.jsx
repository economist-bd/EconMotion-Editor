import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './index.css' // এই লাইনটি মুছে দিন বা কমেন্ট করুন, আমরা App.css ব্যবহার করছি

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const espruinoOriginalHttpGet = httpGet;
console.log(espruinoOriginalHttpGet);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.httpGet = (url: string) => {
  console.log('fetching', url);
  const updatedUrl = new URL(url, "https://banglejs.com/apps/");
  console.log('fetching', url, updatedUrl);
  return espruinoOriginalHttpGet(updatedUrl.href);
}

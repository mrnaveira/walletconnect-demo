import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MetaMaskInpageProvider, TariProvider } from '@tari-project/tarijs';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <App />
);

declare global {

    interface Window {
      tari: TariProvider;
      ethereum: MetaMaskInpageProvider;
    }
}


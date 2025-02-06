import { useEffect, useState } from 'react'
import './App.css'
import useTariProvider from './store/provider';
import { TariConnectButton } from './connect/TariConnectButton';

// TODO: make it an envvar
const projectId = "1825b9dd9c17b5a33063ae91cbc48a6e";

function App() {
  const { provider } = useTariProvider();

  async function handleRun() {
    if (!provider) {
      console.log("Tari.js provider not initialized");
      return;
    }

    console.log(provider.providerName);
  }

  return (
    <>
      <h1>WalletConnect demo</h1>
      <TariConnectButton />
      <div className="card">
        <button onClick={async () => await handleRun()}>
          Run
        </button>
      </div>
    </>
  )

}

export default App

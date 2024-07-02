import { useState } from 'react'
import './App.css'

function App() {

  async function handleWalletConnect() {
    console.log("Hello World!");
  }

  return (
    <>
      <h1>WalletConnect demo</h1>
      <div className="card">
        <button onClick={async () => await handleWalletConnect()}>
          WalletConnect
        </button>
      </div>
    </>
  )
}

export default App

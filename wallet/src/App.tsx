import { useEffect, useState } from 'react'
import './App.css'
import { TextField } from '@mui/material'
import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'

// TODO: make it an envvar
const projectId = "1825b9dd9c17b5a33063ae91cbc48a6e";

function App() {
  const [uri, setUri] = useState<string | undefined>();
  const [web3wallet, setWeb3wallet] = useState<Web3Wallet | undefined>();

  async function initWallet() {
    if (web3wallet) {
      return;
    }

    const core = new Core({ projectId });
    const wallet = await Web3Wallet.init({
      core: core,
      metadata: {
        name: 'Example WalletConnect Wallet',
        description: 'Example WalletConnect Integration',
        url: 'myexamplewallet.com',
        icons: []
      }
    });

    wallet.on('session_proposal', async proposal => {
      console.log({ proposal });

      const session = await wallet.approveSession({
        id: proposal.id,
        namespaces: {
          polkadot: {
            methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
            chains: [
              'polkadot:91b171bb158e2d3848fa23a9f1c25182', // polkadot
            ],
            events: ['chainChanged", "accountsChanged'],
            accounts: [
              "polkadot:91b171bb158e2d3848fa23a9f1c25182:8PSDc8otpZMGviGVSwzCzBCLPi5WuT8K9phaUWbfUtSYet3",
              "polkadot:91b171bb158e2d3848fa23a9f1c25182:A1MbgM4mdFBH4LiTPZWmtVZ3zBGUJApN24FoSK32ZACPGP6"
            ],
          }
        }
      })

      // create response object
      const response = { id: proposal.id, result: 'session approved', jsonrpc: '2.0' }

      // respond to the dapp request with the approved session's topic and response
      await wallet.respondSessionRequest({ topic: session.topic, response })

    });

    wallet.on('session_request', async requestEvent => {
      console.log({ requestEvent });
      const { params, id, topic } = requestEvent;
      const { request } = params;

      switch (request.method) {
        case 'polkadot_signTransaction':
          const { ping } = request.params.transactionPayload;
          console.log({ping});

          // create the response containing the signature in the result
          const response = { id, result: { pong: 'pong' }, jsonrpc: '2.0' }

          // respond to the dapp request with the response and topic
          await wallet.respondSessionRequest({ topic, response });
          break;
        default:
          throw new Error("Invalid method")
      }      
    });

    setWeb3wallet(wallet);
  }

  useEffect(() => {
    if (!web3wallet) {
      initWallet()
      .then(() => console.log("wallet init"))
      .catch((err) => console.error(err));
    }
  }, []);

  async function acceptConnection(uri: string | undefined) {
    if (!uri || !web3wallet) {
      return;
    }

    console.log(uri);

    const result = await web3wallet.pair({ uri });
    console.log({ result });

  }

  return (
    <>
      <h1>WalletConnect Wallet Demo</h1>
      <div className="card">
        <TextField id="outlined-basic" label="Outlined" variant="outlined"
          onChange={(event) => setUri(event?.target.value)} />
        <button onClick={async () => await acceptConnection(uri)}>
          Connect
        </button>
      </div>
    </>
  )
}

export default App

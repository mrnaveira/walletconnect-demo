import { useEffect, useState } from 'react'
import UniversalProvider from '@walletconnect/universal-provider';
import { WalletConnectModal } from '@walletconnect/modal';
import './App.css'


// TODO: make it an envvar
const projectId = "1825b9dd9c17b5a33063ae91cbc48a6e";

const walletConnectParams = {
  requiredNamespaces: {
    polkadot: {
      methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
      chains: [
        'polkadot:91b171bb158e2d3848fa23a9f1c25182', // polkadot
      ],
      events: ['chainChanged", "accountsChanged']
    }
  }
}

function App() {

  const [provider, setProvider] = useState<UniversalProvider | undefined>();

  useEffect(() => {
    if (!provider) {
      console.log("building provider");
      UniversalProvider.init({
        projectId,
        relayUrl: 'wss://relay.walletconnect.com'
      })
        .then((p) => {
          console.log({ provider: p });
          setProvider(p);
        })
        .catch(((err) => console.error(err)));
    }
  }, []);

  async function handleWalletConnect() {
    try {
      if (!provider) {
        console.error("provider not initialized");
        return;
      }

      const { uri, approval } = await provider.client.connect(walletConnectParams);

      console.log({ uri });

      const walletConnectModal = new WalletConnectModal({
        projectId
      });

      if (uri) {
        walletConnectModal.openModal({ uri });
      }

      console.log("await session approval from the wallet app");
      const walletConnectSession = await approval();

      console.log({walletConnectSession});

      const address = walletConnectSession.namespaces.polkadot.accounts[0];

      const requestResult = await provider.client.request({
        topic: walletConnectSession.topic,
        chainId: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
        request: {
          method: 'polkadot_signTransaction',
          params: {
            address,
            transactionPayload: { ping: "ping"}
          }
        }
      });

      console.log({requestResult});

    } catch (error: any) {
      console.error({ error });
    }
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

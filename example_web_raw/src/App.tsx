import { useEffect, useState } from 'react'
import UniversalProvider from '@walletconnect/universal-provider';
import { WalletConnectModal } from '@walletconnect/modal';
import './App.css'

// TODO: make it an envvar
const projectId = "1825b9dd9c17b5a33063ae91cbc48a6e";

const walletConnectParams = {
  requiredNamespaces: {
    tari: {
      methods: [
        'tari_getSubstate',
        'tari_getDefaultAccount',
        'tari_getAccountBalances',
        'tari_submitTransaction',
        'tari_getTransactionResult',
        'tari_getTemplate',
        'tari_createKey',
        'tari_viewConfidentialVaultBalance',
        'tari_createFreeTestCoins'
      ],
      chains: [
        'tari:devnet',
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

      // const address = walletConnectSession.namespaces.tari.accounts[0];

      // tari_getDefaultAccount
      const tari_getDefaultAccount_res: any = await provider.client.request({
        topic: walletConnectSession.topic,
        chainId: 'tari:devnet',
        request: {
          method: 'tari_getDefaultAccount',
          params: {}
        }
      });
      console.log({tari_getDefaultAccount_res});
      const accountAddress = tari_getDefaultAccount_res.account.address;
      const keyIndex = tari_getDefaultAccount_res.account.key_index;

      // tari_getSubstate
      const tari_getSubstate_res = await provider.client.request({
        topic: walletConnectSession.topic,
        chainId: 'tari:devnet',
        request: {
          method: 'tari_getSubstate',
          params: {
            substate_id: accountAddress
          }
        }
      });
      console.log({tari_getSubstate_res});

      // tari_getAccountBalances
      const tari_getAccountBalances_res = await provider.client.request({
        topic: walletConnectSession.topic,
        chainId: 'tari:devnet',
        request: {
          method: 'tari_getAccountBalances',
          params: {
            account: { ComponentAddress: accountAddress },
            refresh: true,
          }
        },
      });
      console.log({tari_getAccountBalances_res});

      // tari_submitTransaction
      const tari_submitTransaction_res: any = await provider.client.request({
        topic: walletConnectSession.topic,
        chainId: 'tari:devnet',
        request: {
          method: 'tari_submitTransaction',
          params: {
            transaction: {
              V1 : {
                network: 16, // localnet
                fee_instructions: [
                  {
                    CallMethod: {
                      component_address: accountAddress,
                      method: "pay_fee",
                      args: ["2000"],
                    },
                  }
                ],
                instructions: [
                  {
                    CallMethod: {
                      component_address: accountAddress,
                      method: "get_balances",
                      args: [],
                    }
                  }
                ],
                inputs: [
                  {
                    substate_id: accountAddress
                  }
                ],
                min_epoch: null,
                max_epoch: null,
                is_seal_signer_authorized: true,
              }
            },
            signing_key_index: keyIndex,
            autofill_inputs: [],
            detect_inputs: true,
            detect_inputs_use_unversioned: true,
            proof_ids: [],
          }
        },
      });
      console.log({tari_submitTransaction_res});
      const transactionId = tari_submitTransaction_res.transaction_id;
      
      // tari_getTransactionResult
      const tari_getTransactionResult_res = await provider.client.request({
        topic: walletConnectSession.topic,
        chainId: 'tari:devnet',
        request: {
          method: 'tari_getTransactionResult',
          params: {
            transaction_id: transactionId
          }
        },
      });
      console.log({tari_getTransactionResult_res});
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

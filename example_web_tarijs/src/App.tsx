import './App.css'
import useTariProvider from './store/provider';
import { TariConnectButton } from './connect/TariConnectButton';
import { Amount, buildTransactionRequest, TransactionBuilder } from '@tari-project/tarijs';
import { AccountTemplate } from '@tari-project/tarijs/dist/templates';

function App() {
  const { provider } = useTariProvider();

  async function handleRun() {
    if (!provider) {
      console.log("Tari.js provider not initialized");
      return;
    }

    console.log(provider.providerName);

    // getAccount
    const account = await provider.getAccount();
    console.log({account});

    // getSubstate
    const substate = await provider.getSubstate(account.address);
    console.log({substate});

    // submitTransaction (a call to the "get_balances" method in the user's account component)
    const fee = new Amount(2000);
    const maxfee = fee.getStringValue();
    const accountComponent = new AccountTemplate(account.address);
    const txBuilder = new TransactionBuilder();
    // TODO: probably the tari.js "provider" API should expose a method to get the current network 
    const network = 16; // localnet. TODO: there should be an enum exported for this
    const transaction = txBuilder
        .feeTransactionPayFromComponent(
          account.address,
          maxfee
        )
        .callMethod(accountComponent.getBalances, [])
        .build();
    const required_substates = [{ substate_id: account.address, version: null }];
    const submitTransactionRequest = buildTransactionRequest(
      transaction,
      account.account_id,
      required_substates,
      // TODO: for a cleaner API regarding optional parameters, the buildTransactionRequest function should instead receive an object with all the options
      undefined,
      undefined,
      network, 
    );
    const submitTransactionResult = await provider.submitTransaction(submitTransactionRequest);
    console.log({submitTransactionResult});

    // getTransactionResult
    const transactionResult = await provider.getTransactionResult(submitTransactionResult.transaction_id);
    console.log({transactionResult});
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

# walletconnect-tarijs-demo

This project provides a simple example of a React web page that allows to connect to a Tari Wallet daemon via WalletConnect.

## Getting Started

You must have access to a Tari Wallet Daemon.

You must make a copy of the `.env.example` file as `.env`. This file includes the id value that WalletConnect needs to match with the Tari Wallet Daemon.

To run in development mode:
```shell
npm install
npm run dev
```
Open the URL as indicated on the command line.

To connect to a Tari Wallet Daemon:
- Click on the `Connect` Button.
- Select the `WalletConnect` option on the modal.
- Copy the connection URL from the `WalletConnect` connection.
- Go to the Tari Wallet Daemon, click on `Connect with WalletConnect` and approve.

The example site is now connected to the Tari Wallet Daemon.

By clicking on the `Run` button, the web will perform some calls to the wallet, including sending a transaction. You can inspect the results of all those actions on the JavaScript console in your browser.

## Distribution

For building and distribution:
```shell
npm install
npm run build
```
The bundled files for deployment or publication will be located under the `dist` folder.


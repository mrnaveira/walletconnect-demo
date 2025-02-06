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

For building and distribution:
```shell
npm install
npm run build
```
The bundled files for deployment or publication will be located under the `dist` folder.


# @tanglepay/ethereum-provider

`@tanglepay/ethereum-provider` is an Ethereum provider adapter for the TanglePay SDK, allowing developers to use popular Ethereum libraries like web3.js with TanglePay without modifying existing code.

[![npm version](https://badge.fury.io/js/tanglepaysdk-ethereumprovider.svg)](https://www.npmjs.com/package/tanglepaysdk-ethereumprovider)

## Installation

\```bash

npm install tanglepaysdk-ethereumprovider

\```

## Usage

To use `@tanglepay/ethereum-provider`, simply replace the default Ethereum provider with the TanglePay provider in your existing Ethereum library, such as web3.js. Here's an example using web3.js:

\```javascript

const web3 = new Web3(window.ethereum)

// Now you can use web3 with TanglePay as you normally would with an Ethereum provider
\```

## Contributing

We welcome contributions to the TanglePay SDK! Please read our [CONTRIBUTING.md](../CONTRIBUTING.md) guide for more information on how to contribute and submit pull requests.

## License

`@tanglepay/ethereum-provider` is released under the [Apache License](../LICENSE).


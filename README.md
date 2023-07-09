# TanglePay SDK Mono Repo

Welcome to the TanglePay SDK mono repo, a collection of packages for interacting with TanglePay, our company's cryptocurrency wallet. The SDK is written in TypeScript and provides a seamless and efficient way for developers to integrate TanglePay wallet functionality into their dapps.

## Packages

This mono repo consists of the following packages:

1. `tanglepaysdk-client`: The core TanglePay SDK package for interacting with the wallet, including account management, transactions, and balance queries.  
package repo is [here](https://github.com/TanglePay/TanglePay-SDK/tree/main/packages/sdk).  
demo page is [here](https://tanglepay.github.io/TanglePay-SDK/packages/sdk/index.html).
2. `tanglepaysdk-ethereumprovider`: An Ethereum provider adapter that enables the use of popular Ethereum libraries like web3.js with TanglePay, allowing developers to leverage existing code without modifications.  
package repo is [here](https://github.com/TanglePay/TanglePay-SDK/tree/main/packages/ethprovider).  
demo page is [here](https://tanglepay.github.io/TanglePay-SDK/packages/ethprovider/index.html).
3. `tanglepaysdk-common`: A shared module with common utilities and interfaces used across the other packages.


## Getting Started

To get started with the TanglePay SDK mono repo, follow these steps:

1. Clone the repo: `git clone https://github.com/TanglePay/TanglePay-SDK.git`
2. Install dependencies: `yarn`
3. Bootstrap the packages: `yarn run bootstrap`
4. Build the packages: `yarn run build`

## Contributing

We encourage developers to contribute to the TanglePay SDK! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) guide for more information on how to contribute and submit pull requests.

## License

TanglePay SDK mono repo is released under the [Apache License](./LICENSE).

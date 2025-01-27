# KiiChain Explorer

A web application for exploring and interacting with the KiiChain blockchain, built with Next.js.

## Features

- 📊 Real-time dashboard statistics
- 👛 Wallet integration (Metamask and Keplr)
- 🔍 Block and transaction explorer
- 💰 Staking and delegation management
- 🏦 Testnet faucet
- 📈 Validator uptime monitoring
- 💼 Smart contract management
- 📊 Chain parameter visualization
- 💱 Token supply and distribution information

## Core Technologies

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- Ethers.js
- Context API for state management

## Prerequisites

- Node.js 16.8.0 or higher
- npm or yarn
- Metamask and/or Keplr wallet installed in browser

## Environment Setup

Create a `.env` file in the project root:

```
NEXT_PUBLIC_JSON_RPC_URL=https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com/
NEXT_PUBLIC_CHAIN_ID=1336
```

## Installation

```bash
# Clone repository
git clone [REPOSITORY_URL]

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── app/                    # Pages and routes (Next.js App Router)
├── components/            # Reusable components
├── context/              # React contexts (Theme, Wallet)
├── hooks/                # Custom hooks
├── lib/                  # Utilities and configurations
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## Core Features

### Dashboard

- Blockchain statistics visualization
- Recent blocks information
- Latest transactions
- Staking metrics

### Wallet

- Metamask and Keplr support
- Balance display
- Asset management
- Transaction history

### Staking

- Validator list
- Delegation information
- Reward management
- Voting power metrics

### Smart Contracts

- Contract explorer
- Bytecode decompiler
- Contract transaction analysis

## API Endpoints

The application interacts with several endpoints:

- `/api/decompile`: Contract decompilation
- RPC: `https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com/`
- REST: `https://lcd.uno.sentry.testnet.v3.kiivalidator.com`

## Themes and Customization

The application includes a theming system with support for light and dark modes, managed through ThemeContext.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[Specify project license]

## Contact

[Team/maintainer contact information]

# Token Swap Demo

A modern, responsive token swap interface built with React, TypeScript, and Vite. This application allows users to swap tokens across different blockchain networks with real-time price tracking, recently used tokens history, and interactive price charts.

| Dark Mode                                                                                                | Light Mode                                                                                                |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| ![Dark Mode](https://github.com/choyweiqiang/token-swap-demo/blob/master/public/6102811948665128138.jpg) | ![Light Mode](https://github.com/choyweiqiang/token-swap-demo/blob/master/public/6102811948665128142.jpg) |

## Features

| Web Feature Demo                                                                                     | Mobile Feature Demo                                                                                       |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| ![Web Feature Demo](https://github.com/choyweiqiang/token-swap-demo/blob/master/public/web_demo.gif) | ![Mobile Feature Demo](https://github.com/choyweiqiang/token-swap-demo/blob/master/public/phone_demo.gif) |

- **Multi-Chain Support**: Switch between different blockchain networks
- **Token Selection**: Search and select from a wide range of tokens
- **Real-Time Price Data**: Fetch current token prices from CoinGecko API
- **Price Conversion**: Automatically calculate token conversion rates
- **Recently Used Tokens**: Track and display recently used tokens with:
  - Price history visualization with interactive charts
  - 25th, 50th, and 75th percentile price indicators
  - Real-time price change percentage
  - Timestamp-based x-axis for historical context
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Local Storage**: Persist user preferences and recently used tokens

## Technology Stack

### Frontend

- **React 19**: UI library for building component-based interfaces
- **TypeScript**: Static typing for improved developer experience
- **Vite**: Fast, modern frontend build tool
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Query**: Data fetching and state management
- **Chart.js & react-chartjs-2**: Interactive charts for price history visualization

### APIs

- **CoinGecko API**: Token price data
- **FunKit API**: Blockchain and token information

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files

## System Design

### Architecture

The application follows a component-based architecture with a clear separation of concerns:

```
src/
├── api/                # API clients and service integrations
├── assets/             # Static assets like icons
├── const/              # Constants and configuration
├── context/            # React context providers
├── features/           # Feature-based components
│   ├── chain-switcher/ # Chain selection functionality
│   └── token-converter/ # Token conversion and recently used tokens
├── hooks/              # Custom React hooks
├── providers/          # Application-wide providers
├── styles/             # Global styles
├── types/              # TypeScript type definitions
├── ui/                 # Reusable UI components
└── utils/              # Utility functions
```

### Data Flow

1. **User Interaction**: User selects chains and tokens through the UI
2. **API Requests**: Application fetches token data and prices from external APIs
3. **State Management**: React state and context manage application state
4. **Local Storage**: User preferences and recently used tokens are persisted
5. **UI Updates**: Components re-render based on state changes

### Recently Used Tokens Feature

The Recently Used Tokens feature tracks the last 4 tokens selected by the user:

- Stores token data, price history, and price change information
- Calculates price trends and percentiles for visualization
- Persists data in localStorage for session continuity
- Prevents re-selection of already active tokens with warning alerts
- Displays interactive price charts with percentile indicators

## Setup and Installation

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:choyweiqiang/token-swap-demo.git
   cd token-swap-demo
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables

   ```bash
   cp .env.local .env
   ```

   Update the api key with your api key

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

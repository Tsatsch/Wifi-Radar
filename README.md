# WiFi-Radar

Map-based WiFi signal verification powered by Web3. Discover, verify, and earn rewards for connectivity data.

## Features

### 🔐 Embedded Smart Wallets
- **Social Login**: Create wallet with Google, Apple, or email
- **No Extensions Needed**: Works in any browser
- **ERC-4337 Smart Wallets**: Account abstraction for advanced features
- **Gasless Transactions**: Users don't need crypto to get started

### 🗺️ Connectivity Verification
- Map-based WiFi signal discovery
- Real-time speed testing
- Signal strength verification
- Earn rewards for verified signals

### ⚡ Powered by Base
- Built on Base blockchain (L2)
- Low transaction costs
- Fast confirmations
- Paymaster support for sponsored transactions

## Quick Start

### Prerequisites
- Node.js 18+
- CDP Project ID from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/products/embedded-wallets)
- Google Maps API Key

### Installation

1. **Clone and navigate to frontend:**
   ```bash
   cd verifi/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp env.example .env.local
   ```

4. **Add your keys to `.env.local`:**
   ```bash
   NEXT_PUBLIC_CDP_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key_here
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## User Experience

### First-Time User Flow
1. **User lands on Radar-Fi** → Sees map with WiFi signals
2. **Runs speed test** → Verification modal appears
3. **Clicks "Create Wallet"** → Chooses social login (Google, Apple, email)
4. **Authenticates** → Smart wallet created automatically
5. **Signs & publishes** → Earns VERI tokens (gasless!)

### Wallet Creation
When creating a wallet, users can choose:
- 🔴 **Google** - Sign in with Google account
- 🍎 **Apple** - Sign in with Apple ID
- 📧 **Email** - Continue with email/SMS

The wallet is created instantly using:
- **ERC-4337** account abstraction
- **Multi-party computation (MPC)** for key management
- **Social recovery** using chosen authentication method

## Architecture

### Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Blockchain**: Base (Ethereum L2)
- **Wallets**: Coinbase Embedded Wallets via `@coinbase/cdp-react`
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Maps**: Google Maps API

### Smart Wallet Features
- **Gasless transactions** via paymaster
- **Batch operations** - multiple actions in one transaction
- **Session keys** - temporary permissions
- **Social recovery** - recover wallet with social login
- **No seed phrases** - managed securely by Coinbase

## Development

### Project Structure
```
frontend/
├── app/
│   ├── rootProvider.tsx    # Wagmi + OnchainKit setup
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main app
│   └── globals.css          # Global styles
├── components/
│   ├── wallet-button.tsx    # Embedded wallet UI
│   ├── map-view.tsx         # Google Maps
│   ├── verification-modal.tsx
│   └── ui/                  # shadcn components
└── env.example              # Environment template
```

### Environment Variables

**Required:**
- `NEXT_PUBLIC_CDP_PROJECT_ID` - From [CDP Portal](https://portal.cdp.coinbase.com/products/embedded-wallets)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - From Google Cloud Console

**Optional:**
- `NEXT_PUBLIC_URL` - Your deployment URL (for wallet callbacks)
- `NEXT_PUBLIC_NETWORK` - `mainnet` or `testnet` (default: testnet)

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables:**
   - `NEXT_PUBLIC_CDP_PROJECT_ID`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - `NEXT_PUBLIC_URL` (your Vercel URL)
   - `NEXT_PUBLIC_NETWORK=mainnet`
4. **Deploy!**

### Enable Paymaster (Production)

For gasless transactions in production:

1. Go to [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Navigate to **Paymaster** section
3. Request production access
4. Add paymaster endpoint to environment variables

## Getting CDP Project ID

1. Visit [https://portal.cdp.coinbase.com/products/embedded-wallets](https://portal.cdp.coinbase.com/products/embedded-wallets)
2. Sign in or create account
3. Click **Create New Project**
4. Configure your project:
   - **App Name**: Veri-Fi
   - **Allowed Origins**: Add your domain(s)
5. Copy your **Project ID**
6. Add to `.env.local`

This enables:
- ✅ Embedded smart wallets
- ✅ Social authentication (Google, Apple, email, SMS)
- ✅ ERC-4337 account abstraction
- ✅ Gasless transactions
- ✅ Custom theming

## Troubleshooting

### Wallet won't create
- ✅ Check `NEXT_PUBLIC_CDP_PROJECT_ID` is correct
- ✅ Verify your domain is in allowed origins (CDP Portal)
- ✅ Enable cookies in browser
- ✅ Try a different browser
- ✅ Clear browser cache

### Map doesn't load
- ✅ Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- ✅ Enable Maps JavaScript API in Google Cloud Console
- ✅ Check API key restrictions

### Build errors
- ✅ Run `npm install` to ensure dependencies are installed
- ✅ Delete `.next` folder and rebuild
- ✅ Check all environment variables are set
- ✅ Verify Node.js version is 18+

## Resources

- [CDP React SDK Demo](https://demo.cdp.coinbase.com/)
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
- [Embedded Wallets Docs](https://docs.cdp.coinbase.com/wallet-sdk/docs)
- [Base Documentation](https://docs.base.org/)

## License

MIT

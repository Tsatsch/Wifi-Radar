# WiFi-Radar

A **public good** platform for discovering and verifying WiFi hotspots with blockchain-backed proof of location. Built on Base, powered by Chainlink, and stored on Filecoin Onchain Cloud.

## Purpose & Value

Veri-Fi solves a critical problem in WiFi discovery: **trust and data freshness**. Traditional WiFi maps suffer from outdated information and fake locations. Veri-Fi provides:

- **Verifiable WiFi Hubs**: Every location is cryptographically verified through Chainlink's Proof of Location
- **Current & Accurate Data**: Community-driven updates ensure WiFi spots stay up-to-date
- **Transparent & Trustless**: All data is stored on-chain and IPFS, making it publicly auditable
- **Public Good**: Free and open for everyone to use and contribute to

## How It Works in detail

### User Flow

1. **Create a WiFi Station**
   - Users can create a new WiFi station by placing a pin on the map
   - The app automatically calculates WiFi speed through real-time testing
   - User submits the location with speed data

2. **Data Storage on IPFS/Filecoin**
   - WiFi data (location, speed, metadata) is stored on IPFS
   - Data is pinned to Filecoin's onchain cloud for permanent, decentralized storage
   - A Content Identifier (CID) is generated for the data

3. **Proof of Location Verification**
   - Backend Chainlink Workflows verify the user's claimed location
   - **Critical Security**: Prevents users from claiming false locations (e.g., "I'm at the airport" while at home)
   - Chainlink compares the user's IP geolocation with their claimed coordinates
   - Only verified locations proceed to the next step

4. **On-Chain Registration**
   - If verification passes, the location is added to the smart contract on Base
   - Contract address: `0x15405de75e94ce71ef3a19cde0b0ae784319217d`
   - The contract stores the IPFS CID reference (not the full data, keeping gas costs low)
   - The submitter is recorded as the owner of the WiFi hub

5. **Data Aggregation & Visualization**
   - The Graph indexes blockchain events to aggregate WiFi spot data
   - Map displays all verified WiFi locations with real-time speed data
   - Users can see current WiFi speeds and contribute updates

### Community-Driven Updates

- **Continuous Speed Tests**: Community members can run speed tests at existing locations
- **Up-to-Date Information**: Regular contributions keep WiFi spot data current
- **Leaderboard**: High contributors are recognized and may receive future perks

## Incentives & Rewards

### First Creator Benefits
- Users who create a WiFi position first are recorded as the **owner** in the smart contract
- Ownership is recognized when the location is validated by other users
- First creators establish the foundation for community verification

### Contributor Recognition
- **Leaderboard**: Users with high contributions are prominently displayed
- **Future Perks**: Top contributors may receive additional benefits (coming soon)
- **Community Impact**: Help others discover reliable WiFi connections

## Technical Architecture

### Frontend
- **Framework**: Next.js 16, React 19, TypeScript
- **Maps**: Google Maps API for interactive map visualization
- **UI**: Tailwind CSS v4, shadcn/ui components
- **Wallets**: Coinbase Embedded Wallets (ERC-4337 smart wallets)

### Blockchain & Infrastructure
- **Network**: Base (Ethereum L2) - Low fees, fast transactions
- **Smart Contract**: `WifiRegistry.sol` on Base (see in contracts/ folder)
  - Contract Address: `0x15405de75e94ce71ef3a19cde0b0ae784319217d`
  - Stores IPFS CIDs and verification status
  - Emits events for The Graph indexing
- **Storage**: IPFS + Filecoin Pin (decentralized, permanent storage)
- **Verification**: Chainlink Workflows for Proof of Location
- **Indexing**: The Graph for querying and aggregating WiFi spot data

### Smart Wallet Features
- **Social Login**: Sign in with Google, Apple, or SMS
- **No Extensions**: Works in any browser
- **Gasless Onboarding**: Paymaster covers gas fees for new users
- **No Prerequisites**: Users don't need tokens to get started

## Quick Start development

### Prerequisites
- Node.js 18+
- CDP Project ID from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/products/embedded-wallets)
- Google Maps API Key
- Filecoin Pin configuration (for IPFS storage)

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables:**
   - `NEXT_PUBLIC_CDP_PROJECT_ID`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - `NEXT_PUBLIC_URL` (vercel url)
   - `NEXT_PUBLIC_NETWORK=mainnet`
   - Filecoin Pin configuration
4. **Deploy!**

### Enable Paymaster (Production)

For gasless transactions in production:

1. Go to [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Navigate to **Paymaster** section
3. Request production access
4. Add paymaster endpoint to environment variables

## Community & Contribution

Veri-Fi is a **public good** that thrives on community participation:

- **Report WiFi Spots**: Help others discover reliable connections
- **Update Existing Spots**: Keep speed data current with regular tests
- **Verify Locations**: Contribute to the verification network
- **Build Together**: Open source and community-driven

We welcome contributions, feedback, and ideas to make Veri-Fi better for everyone!

## Resources and Literature we found especially helpful

- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
- [Embedded Wallets Docs](https://docs.cdp.coinbase.com/wallet-sdk/docs)
- [Base Documentation](https://docs.base.org/)
- [Chainlink Functions](https://docs.chain.link/chainlink-functions)
- [The Graph](https://thegraph.com/)
- [Filecoin](https://filecoin.io/)


# Submit WiFi Spots to WifiRegistry

This directory contains scripts to manually submit WiFi spots to the WifiRegistry contract.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Wallet with Base Sepolia ETH** for gas fees
3. **Private key** of the wallet

## Setup

1. Install dependencies:
```bash
cd scripts
npm install
```

2. Set environment variables:
```bash
export PRIVATE_KEY="your_private_key_here"
export RPC_URL="https://sepolia.base.org"  # Optional, defaults to this
```

Or create a `.env` file:
```
PRIVATE_KEY=your_private_key_here
RPC_URL=https://sepolia.base.org
```

## Usage

Run the submission script:
```bash
npm run submit
```

Or directly:
```bash
npx tsx submit-spots.ts
```

## What the Script Does

1. **Fetches IPFS data**: Downloads JSON files from IPFS to extract latitude/longitude
2. **Converts coordinates**: Converts lat/lng to microdegrees (multiplies by 1,000,000) as required by the contract
3. **Submits to contract**: Calls `submitSpot()` on the WifiRegistry contract
4. **Waits for confirmation**: Waits for transaction confirmation
5. **Shows summary**: Displays success/failure for each spot

## WiFi Spots Included

The script includes 8 WiFi spots with their IPFS CIDs:
- 2 airport free WiFi spots
- 2 coffee shop WiFi spots
- 2 library public WiFi spots
- 1 Sydney cafe WiFi spot
- 1 Tokyo station free WiFi spot

**Note**: The download links point to `.car` (Content Addressed Archive) files. The script will try to fetch the JSON directly from IPFS using the CID. If that fails, you may need to:
1. Download the CAR file from the provided URL
2. Extract the JSON using a tool like `ipfs-car` or `go-ipfs`
3. Manually update the script with lat/lng coordinates

## Querying with GraphQL

After spots are submitted and verified, you can query them using GraphQL:

```bash
# Set your GraphQL endpoint
export GRAPHQL_ENDPOINT="https://api.studio.thegraph.com/query/YOUR_ID/YOUR_SUBGRAPH/VERSION"

# Run the query script
npx tsx query-graphql.ts
```

Or use the query script:
```bash
npm run query
```

## After Submission

1. **Chainlink Verification**: The contract will verify each spot using Chainlink Functions (checks if IP geolocation matches claimed coordinates)
2. **Subgraph Indexing**: Once verified, The Graph subgraph will index the `SpotVerified` events
3. **GraphQL Query**: You can then query the spots using GraphQL

## GraphQL Query

Once spots are verified and indexed, query them like this:

```graphql
{
  wifiSpots(
    first: 100
    where: { verificationScore_gte: 100 }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    spotId
    submitter
    ipfsCid
    verificationScore
    lat
    long
    blockTimestamp
  }
}
```

## Troubleshooting

### "PRIVATE_KEY environment variable is required"
- Make sure you've set the `PRIVATE_KEY` environment variable
- Never commit your private key to git!

### "Failed to fetch IPFS data"
- The script tries multiple IPFS gateways
- If all fail, the IPFS CID might not be accessible yet
- Try accessing the CID directly in a browser

### "Insufficient funds"
- Make sure your wallet has Base Sepolia ETH
- Get testnet ETH from a Base Sepolia faucet

### Transaction fails
- Check that the contract address is correct
- Verify the contract has the Chainlink Functions source code set
- Check that your wallet has the required permissions

## Security Notes

⚠️ **Never commit your private key to version control!**

- Use environment variables or a `.env` file (add `.env` to `.gitignore`)
- Consider using a hardware wallet or a dedicated wallet for testing
- The private key is only used to sign transactions, never sent to any server


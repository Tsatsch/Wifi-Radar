/**
 * Script to manually submit WiFi spots to WifiRegistry contract
 * 
 * Usage:
 *   npx tsx scripts/submit-spots.ts
 * 
 * Make sure to set:
 *   - PRIVATE_KEY: Your wallet private key
 *   - RPC_URL: Base Sepolia RPC endpoint
 *   - CONTRACT_ADDRESS: WifiRegistry contract address
 */

import { ethers } from 'ethers';

// Configuration
const CONTRACT_ADDRESS = '0x15405de75e94ce71ef3a19cde0b0ae784319217d'; // Base Sepolia
const RPC_URL = process.env.RPC_URL || 'https://sepolia.base.org';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

// WiFi spots data with IPFS CIDs extracted from download links
const wifiSpots = [
  {
    name: 'airport-free-wifi-2025-11-22T12-25-00Z',
    ipfsCid: 'bafybeie3k3hqe445fxunrbzzrtesx6vyfdqj6g6vjhpknvi5tge4ofji2y',
    downloadUrl: 'https://calibnet.pspsps.io/ipfs/bafybeie3k3hqe445fxunrbzzrtesx6vyfdqj6g6vjhpknvi5tge4ofji2y?filename=airport-free-wifi-2025-11-22T12-25-00Z.json.car',
  },
  {
    name: 'airport-free-wifi-2025-11-22T14-30-00Z',
    ipfsCid: 'bafybeiapjwpp5wyvogsu2redlzgzi6hl5tb2b3fg5glmsut7sgahcjsq6i',
    downloadUrl: 'https://calibnet.pspsps.io/ipfs/bafybeiapjwpp5wyvogsu2redlzgzi6hl5tb2b3fg5glmsut7sgahcjsq6i?filename=airport-free-wifi-2025-11-22T14-30-00Z.json.car',
  },
  {
    name: 'coffeeshop-wifi-2025-11-22T12-23-00Z',
    ipfsCid: 'bafybeibj4zv6upqppltr2haxus667lvmxiicaxuqibulfiwdig4oylnqtm',
    downloadUrl: 'https://calibnet.pspsps.io/ipfs/bafybeibj4zv6upqppltr2haxus667lvmxiicaxuqibulfiwdig4oylnqtm?filename=coffeeshop-wifi-2025-11-22T12-23-00Z.json.car',
  },
  {
    name: 'coffeeshop-wifi-2025-11-22T13-15-00Z',
    ipfsCid: 'bafybeifwitmpyfdbacdncvwbuririyhwl4t7xyppa7z3y5l7eh7qhlvoiq',
    downloadUrl: 'https://calibnet.pspsps.io/ipfs/bafybeifwitmpyfdbacdncvwbuririyhwl4t7xyppa7z3y5l7eh7qhlvoiq?filename=coffeeshop-wifi-2025-11-22T13-15-00Z.json.car',
  },
  {
    name: 'library-public-2025-11-22T12-27-00Z',
    ipfsCid: 'bafybeiag647lgvfroip2kz5keckez4yuo22spj6lbriguveme43guqqtwu',
    downloadUrl: 'https://calibnet.pspsps.io/ipfs/bafybeiag647lgvfroip2kz5keckez4yuo22spj6lbriguveme43guqqtwu?filename=library-public-2025-11-22T12-27-00Z.json.car',
  },
  {
    name: 'library-public-2025-11-22T15-45-00Z',
    ipfsCid: 'bafybeibjzqvmhyxir3qbqi5zvk2r7qghdnkd45pbceniu3o5ojhkuv24vu',
    downloadUrl: 'https://calibnet.pspsps.io/ipfs/bafybeibjzqvmhyxir3qbqi5zvk2r7qghdnkd45pbceniu3o5ojhkuv24vu?filename=library-public-2025-11-22T15-45-00Z.json.car',
  },
  {
    name: 'sydney-cafe-2025-11-22T12-32-00Z',
    ipfsCid: 'bafybeie6yujbcxggkjpgqxjcjtg563yppandouez3tokc4leje7yk7a5cq',
    downloadUrl: 'https://calibnet.pspsps.io/ipfs/bafybeie6yujbcxggkjpgqxjcjtg563yppandouez3tokc4leje7yk7a5cq?filename=sydney-cafe-2025-11-22T12-32-00Z.json.car',
  },
  {
    name: 'tokyo-station-free-2025-11-22T12-30-00Z',
    ipfsCid: 'bafybeihlr5ieepjy3jkz2j232ndxu4bvekwcozurkyqknbpmuz4rrsoxka',
    downloadUrl: 'https://calibnet.pspsps.io/ipfs/bafybeihlr5ieepjy3jkz2j232ndxu4bvekwcozurkyqknbpmuz4rrsoxka?filename=tokyo-station-free-2025-11-22T12-30-00Z.json.car',
  },
];

// ABI for submitSpot function
const SUBMIT_SPOT_ABI = [
  'function submitSpot(string calldata _ipfsCid, int256 _lat, int256 _long, string calldata _userIP) external returns (bytes32 requestId)',
];

interface WiFiData {
  location: {
    lat: number;
    lng: number;
  };
  speed?: number;
  time?: string;
  wifiName?: string;
  walletAddress?: string;
}

/**
 * Fetch JSON data from IPFS
 */
async function fetchIPFSData(cid: string): Promise<WiFiData | null> {
  const gateways = [
    'https://ipfs.io/ipfs/',
    'https://dweb.link/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
  ];

  for (const gateway of gateways) {
    try {
      const url = `${gateway}${cid}`;
      console.log(`Trying ${url}...`);
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        return data as WiFiData;
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${gateway}:`, error);
      continue;
    }
  }

  return null;
}

/**
 * Convert latitude/longitude to microdegrees (int256)
 */
function toMicrodegrees(coord: number): bigint {
  return BigInt(Math.round(coord * 1_000_000));
}

/**
 * Get user's IP address (placeholder for manual submission)
 */
async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Failed to get IP address, using placeholder');
    return '127.0.0.1'; // Placeholder
  }
}

/**
 * Main submission function
 */
async function submitSpots() {
  if (!PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY environment variable is required');
  }

  console.log('🔗 Connecting to Base Sepolia...');
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUBMIT_SPOT_ABI, wallet);

  console.log(`📝 Wallet: ${wallet.address}`);
  console.log(`📋 Contract: ${CONTRACT_ADDRESS}`);
  console.log(`💰 Balance: ${ethers.formatEther(await provider.getBalance(wallet.address))} ETH\n`);

  const userIP = await getUserIP();
  console.log(`🌐 Using IP: ${userIP}\n`);

  const results: Array<{ name: string; success: boolean; txHash?: string; error?: string }> = [];

  for (const spot of wifiSpots) {
    try {
      console.log(`\n📡 Processing: ${spot.name}`);
      console.log(`   IPFS CID: ${spot.ipfsCid}`);

      // Fetch IPFS data to get lat/lng
      const ipfsData = await fetchIPFSData(spot.ipfsCid);
      
      if (!ipfsData || !ipfsData.location) {
        throw new Error(`Failed to fetch IPFS data or missing location for ${spot.name}`);
      }

      const lat = ipfsData.location.lat;
      const lng = ipfsData.location.lng;
      const latMicro = toMicrodegrees(lat);
      const lngMicro = toMicrodegrees(lng);

      console.log(`   Location: ${lat}, ${lng}`);
      console.log(`   Microdegrees: lat=${latMicro}, lng=${lngMicro}`);

      // Submit to contract
      console.log(`   Submitting to contract...`);
      const tx = await contract.submitSpot(
        spot.ipfsCid,
        latMicro,
        lngMicro,
        userIP
      );

      console.log(`   ⏳ Transaction sent: ${tx.hash}`);
      console.log(`   ⏳ Waiting for confirmation...`);
      
      const receipt = await tx.wait();
      console.log(`   ✅ Confirmed! Block: ${receipt.blockNumber}`);
      console.log(`   📋 Request ID: ${await contract.s_lastRequestId()}`);

      results.push({ name: spot.name, success: true, txHash: receipt.hash });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`   ❌ Error: ${errorMsg}`);
      results.push({ name: spot.name, success: false, error: errorMsg });
    }
  }

  // Summary
  console.log('\n\n📊 Submission Summary:');
  console.log('='.repeat(60));
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Successful: ${successful.length}`);
  successful.forEach((r) => {
    console.log(`   - ${r.name}: ${r.txHash}`);
  });

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}`);
    failed.forEach((r) => {
      console.log(`   - ${r.name}: ${r.error}`);
    });
  }

  console.log('\n💡 Note: Spots will be verified by Chainlink Functions.');
  console.log('   Check the contract events for verification status.');
  console.log('   Once verified, they will appear in The Graph subgraph.');
}

// Run the script
submitSpots().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


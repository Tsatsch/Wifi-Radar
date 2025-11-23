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

/**
 * WiFi Spot Configuration
 * 
 * To add a new spot, add an object to the wifiSpots array with:
 * - name: Descriptive name (optional, for logging)
 * - ipfsCid: The IPFS CID where the JSON data is stored
 * - lat/lng: (Optional) Manual coordinates if IPFS fetch fails
 *            Format: decimal degrees (e.g., 37.7749, -122.4194)
 * 
 * The script will:
 * 1. Try to fetch JSON from IPFS using the CID
 * 2. Extract lat/lng from the JSON (location.lat, location.lng)
 * 3. If IPFS fetch fails, use manual lat/lng if provided
 * 4. Convert to microdegrees and submit to contract
 */
interface WiFiSpotConfig {
  name: string;
  ipfsCid: string;
  lat?: number;  // Manual override (decimal degrees)
  lng?: number;       // Manual override (decimal degrees)
  downloadUrl?: string; // Optional: for reference
}

const wifiSpots: WiFiSpotConfig[] = [
  {
    name: 'airport-free-wifi-2025-11-22T12-25-00Z',
    ipfsCid: 'bafybeie3k3hqe445fxunrbzzrtesx6vyfdqj6g6vjhpknvi5tge4ofji2y',
    downloadUrl: 'https://calibnet.pspsps.io/ipfs/bafybeie3k3hqe445fxunrbzzrtesx6vyfdqj6g6vjhpknvi5tge4ofji2y?filename=airport-free-wifi-2025-11-22T12-25-00Z.json.car',
    // Optional: Add manual coordinates if IPFS fetch fails
    // lat: 37.7749,
    // lng: -122.4194,
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
  
  // ADD MORE SPOTS HERE:
  // {
  //   name: 'my-new-wifi-spot',
  //   ipfsCid: 'bafybei...',  // Your IPFS CID
  //   // Optional: Manual coordinates if IPFS fetch fails
  //   // lat: 40.7128,
  //   // lng: -74.0060,
  // },
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
 * Extract JSON from CAR file buffer
 */
function extractJsonFromCar(buffer: ArrayBuffer): WiFiData | null {
  try {
    const content = new TextDecoder('utf-8', { fatal: false }).decode(buffer);
    
    // Find JSON object start
    let jsonStart = content.indexOf('{"location"');
    if (jsonStart === -1) {
      jsonStart = content.indexOf('{"wifiName"');
    }
    if (jsonStart === -1) {
      jsonStart = content.indexOf('{');
    }
    
    if (jsonStart === -1) {
      return null;
    }
    
    // Find matching closing brace
    let braceCount = 0;
    let jsonEnd = -1;
    let inString = false;
    let escapeNext = false;
    
    for (let i = jsonStart; i < content.length; i++) {
      const char = content[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            jsonEnd = i + 1;
            break;
          }
        }
      }
    }
    
    if (jsonEnd === -1) {
      return null;
    }
    
    const jsonString = content.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonString) as WiFiData;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch JSON data from IPFS
 * Tries multiple gateways and handles both JSON and CAR files
 */
async function fetchIPFSData(cid: string, downloadUrl?: string): Promise<WiFiData | null> {
  // Try calibnet gateway first (since that's where the CAR files are)
  if (downloadUrl) {
    try {
      console.log(`Trying calibnet gateway: ${downloadUrl}...`);
      const response = await fetch(downloadUrl, {
        headers: { 
          'Accept': 'application/json, application/octet-stream, */*'
        },
        signal: AbortSignal.timeout(15000),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        
        // If it's JSON, parse directly
        if (contentType.includes('application/json')) {
          const data = await response.json();
          return data as WiFiData;
        }
        
        // If it's a CAR file or binary, extract JSON
        const arrayBuffer = await response.arrayBuffer();
        const extracted = extractJsonFromCar(arrayBuffer);
        if (extracted) {
          console.log(`   ✅ Extracted JSON from CAR file`);
          return extracted;
        }
      }
    } catch (error) {
      console.warn(`   ⚠️  Calibnet gateway failed:`, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Try standard IPFS gateways
  const gateways = [
    'https://ipfs.io/ipfs/',
    'https://dweb.link/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://trustless-gateway.link/ipfs/',
  ];

  for (const gateway of gateways) {
    try {
      const url = `${gateway}${cid}`;
      console.log(`Trying ${url}...`);
      const response = await fetch(url, {
        headers: { 
          'Accept': 'application/json, application/octet-stream, */*'
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        const text = await response.text();
        
        // Check if it's HTML (error page)
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<!doctype')) {
          console.warn(`   ⚠️  Gateway returned HTML (likely error page)`);
          continue;
        }
        
        // Try parsing as JSON first
        try {
          const data = JSON.parse(text);
          return data as WiFiData;
        } catch {
          // If not JSON, try extracting from CAR file
          const arrayBuffer = await response.arrayBuffer();
          const extracted = extractJsonFromCar(arrayBuffer);
          if (extracted) {
            console.log(`   ✅ Extracted JSON from CAR file`);
            return extracted;
          }
        }
      }
    } catch (error) {
      console.warn(`   ⚠️  Failed:`, error instanceof Error ? error.message : 'Unknown error');
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
      let lat: number;
      let lng: number;
      
      const ipfsData = await fetchIPFSData(spot.ipfsCid, spot.downloadUrl);
      
      if (ipfsData && ipfsData.location) {
        // Use coordinates from IPFS JSON
        lat = ipfsData.location.lat;
        lng = ipfsData.location.lng;
        console.log(`   ✅ Fetched from IPFS`);
      } else if (spot.lat !== undefined && spot.lng !== undefined) {
        // Use manual coordinates if provided
        lat = spot.lat;
        lng = spot.lng;
        console.log(`   ⚠️  IPFS fetch failed, using manual coordinates`);
      } else {
        throw new Error(
          `Failed to fetch IPFS data and no manual coordinates provided for ${spot.name}. ` +
          `Either ensure the IPFS CID is accessible, or add manual lat/lng to the spot config.`
        );
      }
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
      
      // Provide helpful error messages for common issues
      if (errorMsg.includes('0x71e83137') || errorMsg.includes('execution reverted')) {
        console.error(`   💡 This error usually means:`);
        console.error(`      1. Chainlink Functions subscription needs LINK tokens`);
        console.error(`      2. Contract must be added as consumer to subscription`);
        console.error(`      3. Check subscription ID matches contract configuration`);
        console.error(`      See: https://docs.chain.link/chainlink-functions`);
      }
      
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

  console.log('\n💡 Notes:');
  console.log('   - Spots will be verified by Chainlink Functions (takes 30-60 seconds)');
  console.log('   - Check the contract events for verification status');
  console.log('   - Once verified, they will appear in The Graph subgraph');
  
  if (failed.length > 0) {
    console.log('\n⚠️  Troubleshooting failed submissions:');
    console.log('   1. Ensure Chainlink Functions subscription has LINK tokens');
    console.log('   2. Verify contract is added as consumer to subscription');
    console.log('   3. Check subscription ID in contract matches your subscription');
    console.log('   4. Verify source code is set (it appears to be set already)');
    console.log('   See: https://docs.chain.link/chainlink-functions');
  }
}

// Run the script
submitSpots().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


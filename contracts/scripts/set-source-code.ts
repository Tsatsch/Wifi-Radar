/**
 * Script to set Chainlink Functions source code on WifiRegistry contract
 * 
 * Usage:
 *   npx tsx set-source-code.ts
 * 
 * Make sure to set:
 *   - PRIVATE_KEY: Contract owner's private key
 *   - RPC_URL: Base Sepolia RPC endpoint
 */

import { ethers } from 'ethers';

// Configuration
const CONTRACT_ADDRESS = '0x15405de75e94ce71ef3a19cde0b0ae784319217d'; // Base Sepolia
const RPC_URL = process.env.RPC_URL || 'https://sepolia.base.org';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

// Chainlink Functions JavaScript source code
// This code runs on Chainlink Functions nodes to fetch IP geolocation
// Returns: bytes encoded as (int256 lat, int256 lng) in microdegrees
const SOURCE_CODE = `
  // Fetch IP geolocation from ipinfo.io
  const ip = args[0];
  
  if (!ip) {
    throw new Error("IP address is required");
  }
  
  // Use ipinfo.io API (free tier, no token needed for basic usage)
  // If you have a token, you can add: ?token=YOUR_TOKEN
  const url = \`https://ipinfo.io/\${ip}/json\`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(\`Failed to fetch IP info: \${response.status}\`);
  }
  
  const data = await response.json();
  
  // Extract location from "loc" field (format: "lat,lng")
  if (!data.loc) {
    throw new Error("Location not available for this IP");
  }
  
  const [lat, lng] = data.loc.split(',').map(Number);
  
  // Convert to microdegrees (multiply by 1,000,000)
  const latMicro = BigInt(Math.round(lat * 1_000_000));
  const lngMicro = BigInt(Math.round(lng * 1_000_000));
  
  // Encode as ABI-encoded (int256, int256)
  // Chainlink Functions v1.0.0 provides Functions.encodeInt256 helper
  return Functions.encodeInt256(latMicro, lngMicro);
`;

// ABI for setSourceCode function
const SET_SOURCE_CODE_ABI = [
  'function setSourceCode(string memory _source) external',
  'function sourceCode() external view returns (string memory)',
  'function owner() external view returns (address)',
];

/**
 * Set the source code on the contract
 */
async function setSourceCode() {
  if (!PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY environment variable is required');
  }

  console.log('🔗 Connecting to Base Sepolia...');
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SET_SOURCE_CODE_ABI, wallet);

  console.log(`📝 Wallet: ${wallet.address}`);
  console.log(`📋 Contract: ${CONTRACT_ADDRESS}`);
  console.log(`💰 Balance: ${ethers.formatEther(await provider.getBalance(wallet.address))} ETH\n`);

  // Check if wallet is the owner
  try {
    const ownerAddress = await contract.owner();
    const isOwner = ownerAddress.toLowerCase() === wallet.address.toLowerCase();
    
    console.log(`👤 Contract Owner: ${ownerAddress}`);
    console.log(`🔐 Is your wallet the owner? ${isOwner ? '✅ Yes' : '❌ No'}\n`);
    
    if (!isOwner) {
      throw new Error(
        `This wallet (${wallet.address}) is not the contract owner.\n` +
        `The contract owner is: ${ownerAddress}\n` +
        `Please use the owner's private key to set the source code.`
      );
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    if (errorMsg.includes('not the contract owner')) {
      throw error; // Re-throw our custom error
    }
    console.log('⚠️  Could not verify ownership (continuing anyway...)\n');
  }

  // Check current source code
  try {
    const currentSourceCode = await contract.sourceCode();
    if (currentSourceCode && currentSourceCode.length > 0) {
      console.log('⚠️  Source code is already set!');
      console.log(`   Current length: ${currentSourceCode.length} characters`);
      console.log('   First 100 chars:', currentSourceCode.substring(0, 100));
      console.log('\n   Do you want to overwrite it? (This script will proceed)\n');
    }
  } catch (error) {
    console.log('ℹ️  Could not read current source code (might be empty)\n');
  }

  console.log('📝 Setting source code...');
  console.log(`   Source code length: ${SOURCE_CODE.length} characters\n`);

  try {
    const tx = await contract.setSourceCode(SOURCE_CODE);
    console.log(`   ⏳ Transaction sent: ${tx.hash}`);
    console.log(`   ⏳ Waiting for confirmation...`);
    
    const receipt = await tx.wait();
    console.log(`   ✅ Confirmed! Block: ${receipt.blockNumber}`);
    console.log(`   ✅ Source code has been set!\n`);

    // Verify it was set
    const verifySourceCode = await contract.sourceCode();
    if (verifySourceCode === SOURCE_CODE) {
      console.log('✅ Verification: Source code matches!');
    } else {
      console.log('⚠️  Warning: Source code verification failed (might be a display issue)');
    }

    console.log('\n💡 You can now submit WiFi spots using submit-spots.ts');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`   ❌ Error: ${errorMsg}`);
    
    // Check for various owner-related error messages
    if (
      errorMsg.includes('onlyOwner') || 
      errorMsg.includes('Only callable by owner') ||
      errorMsg.includes('not the contract owner') ||
      (error instanceof Error && error.reason && error.reason.includes('owner'))
    ) {
      console.error('\n   ⚠️  Ownership Error Detected!');
      console.error('   This wallet is not the contract owner.');
      console.error('   You need to use the owner wallet\'s private key to set source code.');
      console.error('\n   To fix this:');
      console.error('   1. Find the contract owner address');
      console.error('   2. Use that wallet\'s private key as PRIVATE_KEY environment variable');
      console.error('   3. Run this script again');
    }
    
    throw error;
  }
}

// Run the script
setSourceCode().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


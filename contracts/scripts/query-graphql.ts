/**
 * Example script to query WiFi spots from The Graph
 * 
 * Usage:
 *   npx tsx query-graphql.ts
 * 
 * Make sure to set:
 *   - GRAPHQL_ENDPOINT: Your GraphQL endpoint from The Graph Studio
 */

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_GRAPH_ENDPOINT || '';

interface WifiSpot {
  id: string;
  spotId: string;
  submitter: string;
  ipfsCid: string;
  verificationScore: string;
  lat: string;
  long: string;
  blockTimestamp: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

/**
 * Query all verified WiFi spots
 */
async function queryWifiSpots(): Promise<WifiSpot[]> {
  if (!GRAPHQL_ENDPOINT) {
    throw new Error('GRAPHQL_ENDPOINT environment variable is required');
  }

  const query = `
    query GetWifiSpots {
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
  `;

  console.log('🔍 Querying The Graph...');
  console.log(`   Endpoint: ${GRAPHQL_ENDPOINT}\n`);

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GraphQLResponse<{ wifiSpots: WifiSpot[] }> = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
      throw new Error(result.errors.map((e) => e.message).join(', '));
    }

    return result.data?.wifiSpots || [];
  } catch (error) {
    console.error('❌ Failed to query WiFi spots:', error);
    throw error;
  }
}

/**
 * Convert microdegrees to decimal degrees
 */
function toDecimalDegrees(microdegrees: string): number {
  return Number(microdegrees) / 1_000_000;
}

/**
 * Main function
 */
async function main() {
  try {
    const spots = await queryWifiSpots();

    console.log(`✅ Found ${spots.length} verified WiFi spots\n`);

    if (spots.length === 0) {
      console.log('💡 No spots found. Make sure:');
      console.log('   1. Spots have been submitted to the contract');
      console.log('   2. Spots have been verified by Chainlink Functions');
      console.log('   3. The subgraph has indexed the events');
      console.log('   4. The GraphQL endpoint is correct\n');
      return;
    }

    console.log('📋 WiFi Spots:');
    console.log('='.repeat(80));

    spots.forEach((spot, index) => {
      const lat = toDecimalDegrees(spot.lat);
      const lng = toDecimalDegrees(spot.long);
      const timestamp = new Date(Number(spot.blockTimestamp) * 1000).toISOString();

      console.log(`\n${index + 1}. Spot ID: ${spot.spotId}`);
      console.log(`   IPFS CID: ${spot.ipfsCid}`);
      console.log(`   Location: ${lat}, ${lng}`);
      console.log(`   Verification Score: ${spot.verificationScore}`);
      console.log(`   Submitter: ${spot.submitter}`);
      console.log(`   Timestamp: ${timestamp}`);
      console.log(`   IPFS URL: https://ipfs.io/ipfs/${spot.ipfsCid}`);
    });

    console.log('\n\n💡 To fetch IPFS data, use:');
    console.log('   const data = await fetch(`https://ipfs.io/ipfs/${ipfsCid}`);');
    console.log('   const json = await data.json();');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();


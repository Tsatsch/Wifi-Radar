// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {WifiRegistry} from "../src/WifiRegistry.sol";

/**
 * @title SubmitSpots
 * @notice Foundry script to submit WiFi spots to WifiRegistry contract
 * 
 * Usage:
 *   forge script script/SubmitSpots.s.sol:SubmitSpots \
 *     --rpc-url https://sepolia.base.org \
 *     --broadcast \
 *     --private-key $PRIVATE_KEY
 */
contract SubmitSpots is Script {
    // Contract address on Base Sepolia
    address constant WIFI_REGISTRY = 0x15405de75e94ce71ef3a19cde0b0ae784319217d;
    
    // WiFi spots with IPFS CIDs and coordinates
    // Coordinates are in microdegrees (multiply by 1,000,000)
    struct SpotData {
        string ipfsCid;
        int256 lat;  // in microdegrees
        int256 lng;  // in microdegrees
    }
    
    // You'll need to fetch the JSON files from IPFS first to get lat/lng
    // Then convert to microdegrees: int256 lat = int256(lat * 1_000_000)
    SpotData[] public spots;
    
    function run() external {
        // Initialize spots array with your data
        // Example (you need to fill in actual values from IPFS JSON files):
        // spots.push(SpotData({
        //     ipfsCid: "bafybeie3k3hqe445fxunrbzzrtesx6vyfdqj6g6vjhpknvi5tge4ofji2y",
        //     lat: 37774900,  // 37.7749 * 1,000,000
        //     lng: -122419400 // -122.4194 * 1,000,000
        // }));
        
        vm.startBroadcast();
        
        WifiRegistry registry = WifiRegistry(WIFI_REGISTRY);
        
        // Get user IP (you'll need to set this manually or fetch it)
        string memory userIP = "127.0.0.1"; // Replace with actual IP or fetch dynamically
        
        for (uint256 i = 0; i < spots.length; i++) {
            console.log("Submitting spot:", spots[i].ipfsCid);
            bytes32 requestId = registry.submitSpot(
                spots[i].ipfsCid,
                spots[i].lat,
                spots[i].lng,
                userIP
            );
            console.log("Request ID:", vm.toString(requestId));
        }
        
        vm.stopBroadcast();
    }
    
    /**
     * Helper function to convert decimal degrees to microdegrees
     */
    function toMicrodegrees(int256 degrees) public pure returns (int256) {
        return degrees * 1_000_000;
    }
}


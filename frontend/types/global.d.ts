/**
 * Global type declarations for the Veri-Fi frontend application
 */

import type { ExternalProvider } from "ethers";

declare global {
  interface Window {
    /**
     * Ethereum provider injected by Coinbase Smart Wallet
     * Used for creating ethers.js signers
     */
    ethereum?: ExternalProvider;
  }
}

export {};


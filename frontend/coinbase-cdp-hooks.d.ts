declare module "@coinbase/cdp-hooks" {
  export function useEvmAddress(): {
    evmAddress?: string | null
  }

  export function useSignOut(): {
    signOut: () => Promise<void>
  }
}



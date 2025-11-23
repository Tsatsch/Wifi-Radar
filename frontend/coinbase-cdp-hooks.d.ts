declare module "@coinbase/cdp-hooks" {
  export function useEvmAddress(): {
    evmAddress?: string | null
  }

  export function useSignOut(): {
    signOut: () => Promise<void>
  }

  export function useSignEvmMessage(): {
    signEvmMessage: (options: {
      evmAccount: string
      message: string
    }) => Promise<{ signature: string }>
  }

  export function useSignEvmTypedData(): {
    signEvmTypedData: (options: {
      evmAccount: string  // CDP uses 'evmAccount' not 'address'
      typedData: {
        domain: Record<string, any>
        types: Record<string, Array<any>>
        primaryType: string
        message: Record<string, any>
      }
    }) => Promise<{ signature: string }>
  }

  export function useSendEvmTransaction(): {
    sendEvmTransaction: (options: {
      evmAccount: string
      transaction: Record<string, any>
    }) => Promise<{ transactionHash: string }>
    data: any
  }

  export function useSignEvmTransaction(): {
    signEvmTransaction: (options: {
      evmAccount: string
      transaction: Record<string, any>
    }) => Promise<{ signedTransaction: string }>
  }
}



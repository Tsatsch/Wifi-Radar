 "use client"

import { useState } from "react"
import { AuthButton } from "@coinbase/cdp-react"
import { useEvmAddress, useSignOut } from "@coinbase/cdp-hooks"
import { Button } from "@/components/ui/button"
import { Copy, Check, LogOut, Wallet } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function WalletButton() {
  const { evmAddress } = useEvmAddress()
  const { signOut } = useSignOut()
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (evmAddress) {
      await navigator.clipboard.writeText(evmAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // If wallet is connected, show custom button with address
  if (evmAddress) {
    const shortAddress = `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}`
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
          >
            <Wallet className="h-4 w-4" />
            <span className="font-mono text-xs">{shortAddress}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Wallet Address</span>
              <span className="font-mono text-xs">{shortAddress}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Address</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // If wallet is not connected, show CDP's default AuthButton
  return (
    <div className="relative z-50">
      <AuthButton />
    </div>
  )
}


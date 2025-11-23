 "use client"

import { useState } from "react"
import { AuthButton } from "@coinbase/cdp-react"
import { useEvmAddress, useSignOut } from "@coinbase/cdp-hooks"
import { Button } from "@/components/ui/button"
import { Copy, Check, LogOut, Wallet, X } from "lucide-react"
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
  const [isOpen, setIsOpen] = useState(false)

  const copyAddress = async () => {
    if (evmAddress) {
      await navigator.clipboard.writeText(evmAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  // If wallet is connected, show custom button with address
  if (evmAddress) {
    const shortAddress = `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}`
    
    return (
      <>
        {/* Desktop: Dropdown Menu */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 md:gap-3 bg-glass backdrop-blur-xl border-signal-green/30 hover:bg-signal-green/10 hover:border-signal-green/50 h-12 md:h-[60px] px-3 md:px-5 touch-manipulation transition-all"
              >
                <Wallet className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-signal-green" />
                <span className="font-mono text-[15px] md:text-lg text-foreground">{shortAddress}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-glass backdrop-blur-xl border border-signal-green/20">
              <DropdownMenuLabel className="text-foreground">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-foreground/60">Wallet Address</span>
                  <span className="font-mono text-xs text-signal-green">{shortAddress}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-signal-green/20" />
              <DropdownMenuItem 
                onClick={copyAddress}
                className="hover:bg-signal-green/10 focus:bg-signal-green/10 text-foreground"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-signal-green" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy Address</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="hover:bg-signal-green/10 focus:bg-signal-green/10 text-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile: Overlay with Bottom Sheet */}
        <div className="md:hidden">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(true)}
            className="gap-2 bg-glass backdrop-blur-xl border-signal-green/30 hover:bg-signal-green/10 hover:border-signal-green/50 h-12 px-3 touch-manipulation transition-all"
          >
            <Wallet className="h-5 w-5 shrink-0 text-signal-green" />
            <span className="font-mono text-[15px] text-foreground">{shortAddress}</span>
          </Button>

          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" 
                onClick={() => setIsOpen(false)} 
              />

              {/* Bottom Sheet */}
              <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up rounded-t-3xl bg-glass backdrop-blur-xl border-t border-signal-green/20 p-5 pb-safe">
                {/* Close Button */}
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="absolute right-4 top-4 text-foreground/60 hover:text-foreground active:text-foreground rounded-full p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="mb-4 pr-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-foreground/60">Wallet Address</span>
                    <span className="font-mono text-base text-signal-green break-all">{evmAddress}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      copyAddress()
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-glass border border-signal-green/20 hover:bg-signal-green/10 active:bg-signal-green/20 touch-manipulation transition-all text-foreground"
                  >
                    {copied ? (
                      <>
                        <Check className="h-5 w-5 text-signal-green" />
                        <span className="font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" />
                        <span className="font-medium">Copy Address</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-glass border border-signal-green/20 hover:bg-signal-green/10 active:bg-signal-green/20 touch-manipulation transition-all text-foreground"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    )
  }

  // If wallet is not connected, show CDP's default AuthButton
  return (
    <div className="relative z-50">
      <AuthButton />
    </div>
  )
}


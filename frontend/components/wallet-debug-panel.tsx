"use client"

import { useState } from "react"
import { useEvmAddress, useSignEvmMessage, useSignEvmTypedData } from "@coinbase/cdp-hooks"
import { useCDPSigner } from "@/hooks/use-ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, Loader2, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

/**
 * Debug panel to visualize CDP wallet behavior and test signing operations.
 * Shows wallet address, connection status, and allows testing message/typed data signing.
 */
export function WalletDebugPanel() {
  const { evmAddress } = useEvmAddress()
  const { signEvmMessage } = useSignEvmMessage()
  const { signEvmTypedData } = useSignEvmTypedData()
  const signer = useCDPSigner()
  const { toast } = useToast()

  const [testResult, setTestResult] = useState<{
    message?: string
    typedData?: string
    error?: string
  }>({})
  const [isTestingMessage, setIsTestingMessage] = useState(false)
  const [isTestingTypedData, setIsTestingTypedData] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (evmAddress) {
      await navigator.clipboard.writeText(evmAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const testMessageSigning = async () => {
    if (!evmAddress || !signer) return

    setIsTestingMessage(true)
    setTestResult((prev) => ({ ...prev, message: undefined, error: undefined }))

    try {
      console.log("🧪 Testing message signing...")
      const testMessage = "Hello from Veri-Fi! Testing CDP wallet signing."
      
      // Sign using CDP's native hook
      const result = await signEvmMessage({
        evmAccount: evmAddress,  // CDP uses 'evmAccount', not 'address'
        message: testMessage,
      })

      console.log("✅ Message signed successfully:", result)
      setTestResult((prev) => ({
        ...prev,
        message: result.signature,
      }))

      toast({
        title: "Message signing works! ✅",
        description: "CDP wallet can sign messages",
      })
    } catch (error: any) {
      console.error("❌ Message signing failed:", error)
      setTestResult((prev) => ({
        ...prev,
        error: error.message || "Message signing failed",
      }))

      toast({
        title: "Message signing failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsTestingMessage(false)
    }
  }

  const testTypedDataSigning = async () => {
    if (!evmAddress || !signer) return

    setIsTestingTypedData(true)
    setTestResult((prev) => ({ ...prev, typedData: undefined, error: undefined }))

    try {
      console.log("🧪 Testing typed data signing...")
      
      // Example EIP-712 typed data
      const domain = {
        name: "Veri-Fi Test",
        version: "1",
        chainId: 84532, // Base Sepolia
      }

      const types = {
        TestMessage: [
          { name: "content", type: "string" },
          { name: "timestamp", type: "uint256" },
        ],
      }

      const value = {
        content: "Testing CDP wallet typed data signing",
        timestamp: Date.now(),
      }

      // Sign using CDP's native hook
      const result = await signEvmTypedData({
        evmAccount: evmAddress,  // CDP uses 'evmAccount', not 'address'
        typedData: {  // Pass as object, not JSON.stringify()
          domain,
          types,
          primaryType: "TestMessage",
          message: value,
        },
      })

      console.log("✅ Typed data signed successfully:", result)
      setTestResult((prev) => ({
        ...prev,
        typedData: result.signature,
      }))

      toast({
        title: "Typed data signing works! ✅",
        description: "CDP wallet can sign EIP-712 data",
      })
    } catch (error: any) {
      console.error("❌ Typed data signing failed:", error)
      setTestResult((prev) => ({
        ...prev,
        error: error.message || "Typed data signing failed",
      }))

      toast({
        title: "Typed data signing failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsTestingTypedData(false)
    }
  }

  if (!evmAddress) {
    return (
      <Card className="border-yellow-500/50">
        <CardHeader>
          <CardTitle className="text-yellow-500">Wallet Not Connected</CardTitle>
          <CardDescription>
            Connect your CDP wallet to see debug information
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-cyan-500/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          CDP Wallet Connected
        </CardTitle>
        <CardDescription>
          Your Coinbase embedded wallet is ready
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Address */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Wallet Address</span>
            <Badge variant="outline" className="font-mono text-xs">
              EVM Smart Wallet
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-3 py-2 text-xs font-mono break-all">
              {evmAddress}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyAddress}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Signer Status */}
        <div className="space-y-2">
          <span className="text-sm font-medium">CDP Signer Status</span>
          <div className="flex items-center gap-2">
            {signer ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">
                  Ready (bypasses browser wallets)
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-muted-foreground">
                  Not available
                </span>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Signing Tests */}
        <div className="space-y-3">
          <span className="text-sm font-medium">Test Signing Capabilities</span>
          
          <div className="space-y-2">
            <Button
              onClick={testMessageSigning}
              disabled={isTestingMessage || !signer}
              variant="outline"
              className="w-full"
            >
              {isTestingMessage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Message Signing...
                </>
              ) : (
                <>Test Message Signing</>
              )}
            </Button>

            {testResult.message && (
              <div className="rounded bg-green-500/10 p-2 text-xs">
                <div className="flex items-center gap-2 text-green-500 mb-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="font-medium">Message Signed</span>
                </div>
                <code className="text-muted-foreground break-all">
                  {testResult.message.slice(0, 40)}...
                </code>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={testTypedDataSigning}
              disabled={isTestingTypedData || !signer}
              variant="outline"
              className="w-full"
            >
              {isTestingTypedData ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Typed Data Signing...
                </>
              ) : (
                <>Test EIP-712 Signing</>
              )}
            </Button>

            {testResult.typedData && (
              <div className="rounded bg-green-500/10 p-2 text-xs">
                <div className="flex items-center gap-2 text-green-500 mb-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="font-medium">Typed Data Signed</span>
                </div>
                <code className="text-muted-foreground break-all">
                  {testResult.typedData.slice(0, 40)}...
                </code>
              </div>
            )}
          </div>

          {testResult.error && (
            <div className="rounded bg-red-500/10 p-2 text-xs">
              <div className="flex items-center gap-2 text-red-500 mb-1">
                <XCircle className="h-3 w-3" />
                <span className="font-medium">Signing Failed</span>
              </div>
              <code className="text-muted-foreground break-all">
                {testResult.error}
              </code>
            </div>
          )}
        </div>

        <Separator />

        {/* Wallet Ready Status */}
        <div className="rounded bg-cyan-500/10 p-3 text-xs space-y-1">
          <div className="flex items-center gap-2 text-cyan-500 font-medium">
            <CheckCircle2 className="h-4 w-4" />
            <span>Wallet Ready</span>
          </div>
          <p className="text-muted-foreground">
            Your wallet is configured and ready to sign transactions.
            The CDP signer bypasses browser wallet conflicts.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


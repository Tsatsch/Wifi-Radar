import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadResult {
  cid: string;  // Mock CID (simulated upload)
}

/**
 * Mock hook for uploading JSON data.
 * Returns a fake CID immediately to simulate a successful upload.
 * 
 * @example
 * ```tsx
 * const { uploadData, status, result, error } = useFilecoinUpload();
 * const cid = await uploadData({ speed: 100, ssid: "MyWiFi", ... });
 * ```
 */
export const useFilecoinUpload = () => {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Mock upload that returns a fake CID immediately.
   * @param data - The data object to upload (will be JSON stringified)
   * @returns A mock CID string or null on error
   */
  const uploadData = async (data: any): Promise<string | null> => {
    try {
      setStatus("uploading");
      setError(null);
      setResult(null);
      setStatusMessage("Simulating upload...");

      // Simulate a brief upload delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate a mock CID based on the data hash
      const dataHash = btoa(JSON.stringify(data)).slice(0, 20).replace(/[^a-zA-Z0-9]/g, '');
      const mockCid = `mock_${dataHash}${Date.now().toString(36)}`;
      
      console.log("📦 Mock upload complete. CID:", mockCid);
      
      const uploadResult: UploadResult = {
        cid: mockCid,
      };

      setResult(uploadResult);
      setStatus("success");
      setStatusMessage("Upload simulated successfully!");

      toast({
        title: "Upload successful!",
        description: `Data upload simulated. Mock CID: ${mockCid.slice(0, 20)}...`,
      });

      return mockCid;
    } catch (err: any) {
      console.error("Mock upload failed:", err);
      const errorMessage = err?.message || "Failed to simulate upload";
      setError(errorMessage);
      setStatus("error");
      setStatusMessage("");

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  };

  /**
   * Reset the upload state for a new upload
   */
  const reset = () => {
    setStatus("idle");
    setStatusMessage("");
    setResult(null);
    setError(null);
  };

  return {
    uploadData,
    status,
    statusMessage,
    result,
    error,
    isUploading: status === "uploading",
    isSuccess: status === "success",
    isError: status === "error",
    reset,
  };
};


import { cre, consensusMedianAggregation, type NodeRuntime, type Runtime } from "@chainlink/cre-sdk";

interface SpeedData {
  lat: number;
  lon: number;
  timestamp: string;
  ip: string;
  walletAddress: string;
  speed: number;
}

interface StatsResult {
  totalInputs: number;
  averageSpeed: number;
  medianSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  speedRange: number;
  speeds: number[];
}

// Function to calculate average speed on each node
const calculateAverageOnNode = (nodeRuntime: NodeRuntime<any>, speeds: number[]) => {
  if (speeds.length === 0) return 0;
  const sum = speeds.reduce((acc, val) => acc + val, 0);
  return sum / speeds.length;
};

// Function to calculate median speed on each node
const calculateMedianOnNode = (nodeRuntime: NodeRuntime<any>, speeds: number[]) => {
  if (speeds.length === 0) return 0;
  const sortedSpeeds = [...speeds].sort((a, b) => a - b);
  const mid = Math.floor(sortedSpeeds.length / 2);
  return sortedSpeeds.length % 2 === 0
    ? (sortedSpeeds[mid - 1] + sortedSpeeds[mid]) / 2
    : sortedSpeeds[mid];
};

// Function to calculate min speed on each node
const calculateMinOnNode = (nodeRuntime: NodeRuntime<any>, speeds: number[]) => {
  if (speeds.length === 0) return 0;
  return Math.min(...speeds);
};

// Function to calculate max speed on each node
const calculateMaxOnNode = (nodeRuntime: NodeRuntime<any>, speeds: number[]) => {
  if (speeds.length === 0) return 0;
  return Math.max(...speeds);
};

// Main function to calculate speed statistics using CRE
export const calculate_stats = (runtime: Runtime<any>, input: { speedData: SpeedData[] }): StatsResult => {
  const { speedData } = input;
  
  if (!speedData || speedData.length === 0) {
    throw new Error("No speed data provided for statistics calculation");
  }
  
  runtime.log(`Calculating speed statistics for ${speedData.length} speed measurements using CRE`);
  
  // Extract speeds for calculation
  const speeds = speedData.map(entry => entry.speed);
  
  if (speeds.length === 0) {
    throw new Error("No speed data available for calculation");
  }

  runtime.log("Running calculations on nodes with consensus...");
  
  // Calculate average using consensus across nodes
  const consensusAverage = runtime.runInNodeMode(
    (nodeRuntime: NodeRuntime<any>) => calculateAverageOnNode(nodeRuntime, speeds),
    consensusMedianAggregation()
  )().result();

  // Calculate median using consensus across nodes
  const consensusMedian = runtime.runInNodeMode(
    (nodeRuntime: NodeRuntime<any>) => calculateMedianOnNode(nodeRuntime, speeds),
    consensusMedianAggregation()
  )().result();

  // Calculate min using consensus across nodes
  const consensusMin = runtime.runInNodeMode(
    (nodeRuntime: NodeRuntime<any>) => calculateMinOnNode(nodeRuntime, speeds),
    consensusMedianAggregation()
  )().result();

  // Calculate max using consensus across nodes
  const consensusMax = runtime.runInNodeMode(
    (nodeRuntime: NodeRuntime<any>) => calculateMaxOnNode(nodeRuntime, speeds),
    consensusMedianAggregation()
  )().result();

  const speedRange = consensusMax - consensusMin;
  
  const result: StatsResult = {
    totalInputs: speedData.length,
    averageSpeed: parseFloat(consensusAverage.toFixed(2)),
    medianSpeed: parseFloat(consensusMedian.toFixed(2)),
    minSpeed: parseFloat(consensusMin.toFixed(2)),
    maxSpeed: parseFloat(consensusMax.toFixed(2)),
    speedRange: parseFloat(speedRange.toFixed(2)),
    speeds: speeds.map(s => parseFloat(s.toFixed(2)))
  };
  
  runtime.log(`Speed statistics calculated: avg=${result.averageSpeed} Mbps, median=${result.medianSpeed} Mbps, range=${result.minSpeed}-${result.maxSpeed} Mbps`);
  
  return result;
};

import { useCallback, useState } from "react";
import { getRandomBadScenario } from "@/lib/bad-mock-stream-data";

export function useBadStream() {
  const [rawStream, setRawStream] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  const startSimulation = useCallback(async () => {
    // Reset state
    setRawStream("");
    setIsStreaming(true);

    // Get XML chunks from mock data
    const xmlChunks = getRandomBadScenario();

    // Stream chunks by appending to the raw string
    let accumulatedStream = "";
    for (const chunk of xmlChunks) {
      await new Promise((resolve) =>
        setTimeout(resolve, 2 + Math.random() * 10),
      );

      // Bad practice: just append to the raw string
      accumulatedStream += chunk;
      setRawStream(accumulatedStream);
    }

    setIsStreaming(false);
  }, []);

  return { rawStream, isStreaming, startSimulation };
}

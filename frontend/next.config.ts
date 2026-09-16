import type { NextConfig } from "next";
import submission from "./proofdata.config.json";

const nextConfig: NextConfig = {
  // Public submission target. Overrides stale local public deployment settings.
  env: {
    NEXT_PUBLIC_PROOFDATA_CONTRACT_ADDRESS: submission.contractAddress,
  },
};

export default nextConfig;

import type { NextConfig } from "next";
const revision = process.env.VERCEL_GIT_COMMIT_SHA;
const config: NextConfig = {
  env: {
    NEXT_PUBLIC_CASEZERO_BUILD:
      revision && /^[a-f0-9]{40}$/i.test(revision)
        ? revision.slice(0, 7)
        : "local",
  },
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1"],
};
export default config;

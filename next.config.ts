import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lucide-react 是 ESM-only 包，Webpack 需要转译
  transpilePackages: ["lucide-react"],
};

export default nextConfig;

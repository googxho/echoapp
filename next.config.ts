/*
 * @Auther: googxho
 * @Date: 2025-05-22 10:09:31
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-24 12:02:49
 * @FilePath: \echoapp\next.config.ts
 * @Description: 
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/webdav/:path*',
        destination: 'https://dav.jianguoyun.com/dav/:path*',
      },
      {
        source: '/dav/:path*',
        destination: 'https://dav.jianguoyun.com/dav/:path*',
      },
    ];
  },
};

export default nextConfig;

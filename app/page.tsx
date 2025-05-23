/*
 * @Auther: googxho
 * @Date: 2025-05-21 23:40:00
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-21 22:43:42
 * @FilePath: /echoapp/app/page.tsx
 * @Description: 主页重定向
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/mine');
  }, [router]);
  
  return null;
}

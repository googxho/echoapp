/*
 * @Auther: xinhong.gong
 * @Date: 2025-05-21 21:59:57
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-21 22:02:37
 * @FilePath: /echoapp/app/login/page.tsx
 * @Description: 
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import WechatLoginModal from '../components/WechatLoginModal';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isWechatModalOpen, setIsWechatModalOpen] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟登录成功
    const fakeToken = '123456';
    document.cookie = `token=${fakeToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 设置7天有效期
    
    router.replace('/mine');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#3DD598" />
                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-bold">echoapp</span>
          </div>
        </div>

        <h1 className="text-center text-xl font-medium mb-8">账号登录</h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              placeholder="手机号/邮箱"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#3DD598] text-white rounded-md hover:bg-[#32C089] transition duration-200"
          >
            登录
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <Link href="/forgot-password" className="text-gray-500 hover:text-gray-700">
            忘记密码
          </Link>
          <Link href="/register" className="text-blue-500">
            立即注册
          </Link>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">其他登录方式</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => setIsWechatModalOpen(true)}
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#07C160" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5,10c0-4.4,4.5-8,10-8s10,3.6,10,8s-4.5,8-10,8c-1.2,0-2.3-0.2-3.4-0.5l-3.6,1.7c-0.1,0.1-0.3,0.1-0.4,0.1 c-0.3,0-0.5-0.2-0.5-0.5c0-0.1,0-0.2,0.1-0.2l1.4-2.9C4.2,14.7,2.5,12.5,2.5,10z M9.7,8.2c-0.8,0-1.5,0.7-1.5,1.5 s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S10.5,8.2,9.7,8.2z M15.3,8.2c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5 S16.1,8.2,15.3,8.2z" />
              </svg>
              <span>使用微信信息登录</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* 微信登录模态窗口 */}
      <WechatLoginModal 
        isOpen={isWechatModalOpen} 
        onClose={() => setIsWechatModalOpen(false)} 
      />
    </div>
  );
}

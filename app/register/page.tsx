/*
 * @Auther: xinhong.gong
 * @Date: 2025-05-21 22:20:37
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-21 22:20:37
 * @FilePath: /echoapp/app/register/page.tsx
 * @Description: 注册页面
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Register() {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 处理发送验证码
  const handleSendCode = () => {
    if (!phone) {
      alert('请输入手机号');
      return;
    }
    
    // 模拟发送验证码
    console.log('发送验证码到:', phone);
    
    // 设置倒计时
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  // 处理注册
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!phone) {
      alert('请输入手机号');
      return;
    }
    
    if (!verificationCode) {
      alert('请输入验证码');
      return;
    }
    
    if (!nickname) {
      alert('请输入昵称');
      return;
    }
    
    if (!password) {
      alert('请输入密码');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    if (!agreeTerms) {
      alert('请阅读并同意用户协议和隐私政策');
      return;
    }
    
    // 处理注册逻辑
    console.log('注册信息:', { phone, verificationCode, nickname, password });
    
    // 注册成功后可以跳转到登录页
    alert('注册成功，请登录');
    // 这里可以添加路由跳转到登录页
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

        <h1 className="text-center text-xl font-medium mb-8">账号注册</h1>

        <form onSubmit={handleRegister}>
          <div className="mb-4 relative">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="中国大陆手机号，纯数字"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={countdown > 0}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-green-500 hover:text-green-600 disabled:text-gray-400"
            >
              {countdown > 0 ? `获取验证码(${countdown}s)` : '获取验证码'}
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="验证码"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="昵称"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再次输入密码"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="mb-6 flex items-start">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 mr-2"
            />
            <label htmlFor="agreeTerms" className="text-sm text-gray-600">
              我已阅读并同意 <a href="#" className="text-blue-500">用户协议</a> 和 <a href="#" className="text-blue-500">隐私政策</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#3DD598] text-white rounded-md hover:bg-[#32C089] transition duration-200"
          >
            确定
          </button>
        </form>

        <div className="flex justify-center mt-4 text-sm">
          <Link href="/login" className="text-blue-500">
            返回登录
          </Link>
        </div>
      </div>
    </div>
  );
}

/*
 * @Auther: xinhong.gong
 * @Date: 2025-05-21 22:10:37
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-21 22:10:37
 * @FilePath: /echoapp/app/forgot-password/page.tsx
 * @Description: 忘记密码页面
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPassword() {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: 输入手机号, 2: 输入验证码和新密码
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
    
    // 进入下一步
    setStep(2);
  };

  // 处理重置密码
  const handleResetPassword = (e: React.FormEvent) => {
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
    
    if (!newPassword) {
      alert('请输入新密码');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    // 处理重置密码逻辑
    console.log('重置密码:', { phone, verificationCode, newPassword });
    
    // 重置成功后可以跳转到登录页
    alert('密码重置成功，请使用新密码登录');
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
            <span className="text-2xl font-bold">flomo</span>
          </div>
        </div>

        <h1 className="text-center text-xl font-medium mb-8">重置密码</h1>

        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="中国大陆手机号，纯数字"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              disabled={step === 2}
            />
          </div>

          {step === 2 && (
            <>
              <div className="mb-4 relative">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="验证码"
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
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="新密码"
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
            </>
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={handleSendCode}
              className="w-full py-3 bg-[#3DD598] text-white rounded-md hover:bg-[#32C089] transition duration-200"
            >
              获取验证码
            </button>
          ) : (
            <button
              type="submit"
              className="w-full py-3 bg-[#3DD598] text-white rounded-md hover:bg-[#32C089] transition duration-200"
            >
              确定
            </button>
          )}
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

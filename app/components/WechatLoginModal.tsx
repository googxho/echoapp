/*
 * @Auther: xinhong.gong
 * @Date: 2025-05-21 23:10:00
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-21 23:10:00
 * @FilePath: /echoapp/app/components/WechatLoginModal.tsx
 * @Description: 微信登录模态窗口组件
 */
'use client';

import Modal from './Modal';
import Image from 'next/image';

interface WechatLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WechatLoginModal({ isOpen, onClose }: WechatLoginModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="微信登录">
      <div className="flex flex-col items-center py-4">
        <div className="mb-4">
          <svg className="w-16 h-16" viewBox="0 0 24 24" fill="#07C160" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5,10c0-4.4,4.5-8,10-8s10,3.6,10,8s-4.5,8-10,8c-1.2,0-2.3-0.2-3.4-0.5l-3.6,1.7c-0.1,0.1-0.3,0.1-0.4,0.1 c-0.3,0-0.5-0.2-0.5-0.5c0-0.1,0-0.2,0.1-0.2l1.4-2.9C4.2,14.7,2.5,12.5,2.5,10z M9.7,8.2c-0.8,0-1.5,0.7-1.5,1.5 s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S10.5,8.2,9.7,8.2z M15.3,8.2c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5 S16.1,8.2,15.3,8.2z" />
          </svg>
        </div>
        
        <p className="text-center mb-6">请使用微信扫描二维码登录</p>
        
        <div className="border-4 border-[#07C160] p-2 rounded-md mb-6">
          {/* 这里放置二维码图片，实际项目中应该从后端获取 */}
          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
            {/* 使用svg 随便生成一个二维码 */}
            <Image src="/qrcode.png" alt="二维码" width={200} height={200} />
          </div>
        </div>
        
        <p className="text-sm text-gray-500">打开微信，点击 + 号，使用&quot;扫一扫&quot;即可登录</p>
      </div>
    </Modal>
  );
}

/*
 * @Auther: googxho
 * @Date: 2025-05-22
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-24 11:26:45
 * @FilePath: \echoapp\app\components\WebDAVConfigModal.tsx
 * @Description: WebDAV配置模态窗口组件
 */
'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { saveWebDAVConfig, getWebDAVConfig } from '../utils/webdavClient';

interface WebDAVConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function WebDAVConfigModal({ isOpen, onClose, onSave }: WebDAVConfigModalProps) {
  const [serverUrl, setServerUrl] = useState('https://dav.jianguoyun.com/dav/echoapp/');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 加载已保存的配置
  useEffect(() => {
    if (isOpen) {
      const loadConfig = async () => {
        try {
          const config = await getWebDAVConfig();
          if (config) {
            setServerUrl(config.serverUrl || '');
            setUsername(config.username || '');
            setPassword(config.password || '');
          }
        } catch (err) {
          console.error('加载WebDAV配置失败:', err);
        }
      };
      
      loadConfig();
    }
  }, [isOpen]);
  
  const handleSave = async () => {
    // 验证输入
    if (!serverUrl) {
      setError('请输入服务器地址');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // 保存配置
      await saveWebDAVConfig({
        serverUrl,
        username,
        password
      });
      
      onSave();
      onClose();
    } catch (err) {
      console.error('保存WebDAV配置失败:', err);
      setError('保存配置失败，请检查输入信息');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="WebDAV配置">
      <div className="space-y-4">
        <div>
          <label htmlFor="server-url" className="block text-sm font-medium text-gray-700 mb-1">
            服务器地址
          </label>
          <input
            id="server-url"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="https://your-webdav-server.com/remote.php/webdav/"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            用户名
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            密码
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <div className="flex justify-end space-x-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 rounded-md text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

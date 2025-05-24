/*
 * @Auther: googxho
 * @Date: 2025-05-22
 * @LastEditors: googxho gxh522@qq.com
 * @LastEditTime: 2025-05-24 11:18:42
 * @FilePath: \echoapp\app\utils\webdavClient.ts
 * @Description: WebDAV客户端工具
 */
import { createClient, WebDAVClient, FileStat } from "webdav";

// WebDAV配置类型
export interface WebDAVConfig {
  serverUrl: string;
  username: string;
  password: string;
}

// 存储配置的键名
const WEBDAV_CONFIG_KEY = 'webdav_config';

// 客户端实例
let webdavClient: WebDAVClient | null = null;

/**
 * 获取代理URL
 * 将外部WebDAV服务器URL转换为本地代理URL，以避免CORS问题
 * @param url 原始WebDAV服务器URL
 * @returns 代理URL
 */
const getProxyUrl = (url: string): string => {
  // 检查是否是坚果云WebDAV地址
  if (url.includes('dav.jianguoyun.com/dav')) {
    // 使用本地代理 - 支持两种URL格式
    // 1. 使用 /api/webdav 路径 (API路由方式)
    // 2. 使用 /dav 路径 (直接重写方式)
    return url.replace('https://dav.jianguoyun.com/dav', '/dav');
  }
  return url;
};

/**
 * 初始化WebDAV客户端
 * @param config WebDAV配置
 * @returns WebDAV客户端实例
 */
export const initWebDAVClient = (config: WebDAVConfig): WebDAVClient => {
  if (!config.serverUrl) {
    throw new Error('WebDAV服务器地址不能为空');
  }
  
  // 使用代理URL
  const proxyUrl = getProxyUrl(config.serverUrl);
  
  webdavClient = createClient(
    proxyUrl,
    {
      username: config.username,
      password: config.password,
    }
  );
  
  return webdavClient;
};

/**
 * 获取WebDAV客户端实例
 * @returns WebDAV客户端实例
 */
export const getWebDAVClient = async (): Promise<WebDAVClient> => {
  if (webdavClient) {
    return webdavClient;
  }
  
  // 尝试从localStorage加载配置
  const config = await getWebDAVConfig();
  if (config) {
    return initWebDAVClient(config);
  }
  
  throw new Error('WebDAV客户端未初始化，请先配置WebDAV');
};

/**
 * 保存WebDAV配置
 * @param config WebDAV配置
 */
export const saveWebDAVConfig = async (config: WebDAVConfig): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(WEBDAV_CONFIG_KEY, JSON.stringify(config));
    // 初始化客户端
    initWebDAVClient(config);
  }
};

/**
 * 获取保存的WebDAV配置
 * @returns WebDAV配置
 */
export const getWebDAVConfig = async (): Promise<WebDAVConfig | null> => {
  if (typeof window !== 'undefined') {
    const configStr = localStorage.getItem(WEBDAV_CONFIG_KEY);
    if (configStr) {
      return JSON.parse(configStr) as WebDAVConfig;
    }
  }
  return null;
};

/**
 * 检查WebDAV连接是否已配置
 * @returns 是否已配置
 */
export const isWebDAVConfigured = async (): Promise<boolean> => {
  const config = await getWebDAVConfig();
  return !!config && !!config.serverUrl;
};

/**
 * 获取目录内容
 * @param path 目录路径
 * @returns 目录内容列表
 */
export const listFiles = async (path: string = '/'): Promise<FileStat[]> => {
  try {
    const client = await getWebDAVClient();
    const contents = await client.getDirectoryContents(path) as FileStat[];
    return contents;
  } catch (error) {
    console.error('获取WebDAV目录内容失败:', error);
    throw error;
  }
};

/**
 * 获取文件内容
 * @param path 文件路径
 * @returns 文件内容
 */
export const getFileContents = async (path: string): Promise<string> => {
  try {
    const client = await getWebDAVClient();
    const content = await client.getFileContents(path, { format: 'text' }) as string;
    return content;
  } catch (error) {
    console.error('获取WebDAV文件内容失败:', error);
    throw error;
  }
};

/**
 * 创建目录
 * @param path 目录路径
 */
export const createDirectory = async (path: string): Promise<void> => {
  try {
    const client = await getWebDAVClient();
    await client.createDirectory(path);
  } catch (error) {
    console.error('创建WebDAV目录失败:', error);
    throw error;
  }
};

/**
 * 上传文件
 * @param path 文件路径
 * @param content 文件内容
 */
export const uploadFile = async (path: string, content: string | ArrayBuffer): Promise<void> => {
  try {
    const client = await getWebDAVClient();
    await client.putFileContents(path, content);
  } catch (error) {
    console.error('上传WebDAV文件失败:', error);
    throw error;
  }
};

/**
 * 删除文件或目录
 * @param path 文件或目录路径
 */
export const deleteItem = async (path: string): Promise<void> => {
  try {
    const client = await getWebDAVClient();
    await client.deleteFile(path);
  } catch (error) {
    console.error('删除WebDAV项目失败:', error);
    throw error;
  }
};

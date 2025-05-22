/*
 * @Auther: 你的名字
 * @Date: 2025-05-22
 * @LastEditors: 你的名字
 * @LastEditTime: 2025-05-22
 * @FilePath: /echoapp/app/indexedDBManager.ts
 * @Description: IndexedDB 数据库管理
 */

import { EchoData } from "./EchoDataTypes";

// 定义数据库名称和版本
const DB_NAME = 'echoapp';
const DB_VERSION = 1;

// 初始化数据库
export const initDB = (json: EchoData) => {
  if (!indexedDB) {
    return Promise.reject('IndexedDB is not supported in this browser.');
  }
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // 数据库版本变更时触发
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 遍历 JSON 数据的每个键，为每个键创建一个对象存储空间
      for (const key in json) {
        if (json.hasOwnProperty(key)) {
          if (!db.objectStoreNames.contains(key)) {
            db.createObjectStore(key, { keyPath: 'id', autoIncrement: true });
          }
        }
      }
    };

    // 数据库打开成功
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(Object.keys(json), 'readwrite');

      // 将 JSON 数据插入到对应的对象存储空间
      for (const key in json) {
        if (json.hasOwnProperty(key)) {
          const store = transaction.objectStore(key);
          (json[key] as Array<unknown>).forEach((item) => {
            store.add(item);
          });
        }
      }

      transaction.oncomplete = () => {
        db.close();
        resolve(db);
      };

      transaction.onerror = (error) => {
        db.close();
        reject(error);
      };
    };

    // 数据库打开失败
    request.onerror = (error) => {
      reject(error);
    };
  });
};

// 获取数据库中的数据
export const getDataFromDB = (storeName: string) => {
  return new Promise<[]>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getDataRequest = store.getAll();

      getDataRequest.onsuccess = (event) => {
        db.close();
        resolve((event.target as IDBRequest).result);
      };

      getDataRequest.onerror = (error) => {
        db.close();
        reject(error);
      };
    };

    request.onerror = (error) => {
      reject(error);
    };
  });
};

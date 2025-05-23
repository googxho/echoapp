// utils/webdavClient.ts
import { createClient } from "webdav";

export const webdavClient = createClient(
  "https://your-webdav-server.com/remote.php/webdav/",
  {
    username: "your-username",
    password: "your-password",
  }
);

// 示例：获取根目录文件列表
export const listFiles = async () => {
  const contents = await webdavClient.getDirectoryContents("/");
  return contents;
};

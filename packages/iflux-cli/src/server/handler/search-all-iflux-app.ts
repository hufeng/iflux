import fs from 'fs-extra';

/**
 * 返回iflux.config.js目录下的所有的目录
 *
 * @param path 当前的iflux的标准目录
 */
export const searchAllIfluxApp = async (path: string) => {
  const paths = await fs.readdir(path);
  return paths.filter(p => fs.statSync(p).isDirectory());
};

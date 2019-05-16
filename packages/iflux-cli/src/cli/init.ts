#!/usr/bin/env node
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

// 获取当前目录
const curDir = process.cwd();

(async () => {
  // 检查当前的目录是不是已经包含了配置文件
  const configFile = path.join(curDir, 'iflux.config.js');
  const isExisted = await fs.pathExists(configFile);
  if (isExisted) {
    console.error(chalk.red(`${configFile}文件已经存在`));
    return;
  }

  // 创建配置文件
  await fs.writeFile(
    configFile,
    `
 module.exports = {
   lang: 'ts',    // [ts|js]. default ts,
   target: 'web'  // [web|rn|mpapp] default web
 }
  `
  );
  console.log(chalk.green('create iflux.config.js successfully'));
})();

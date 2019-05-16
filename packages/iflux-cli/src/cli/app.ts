#!/usr/bin/env node
import cameCase from 'camelcase';
import chalk from 'chalk';
import commander from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { jsAction, jsIndex, jsRelax, jsStore } from './template/js';
import { tsAction, tsIndex, tsRelax, tsStore } from './template/ts';

commander.parse(process.argv);

// 获取当前的路径
const curDir = process.cwd();
// 获取当前的appName
const appDir = commander.args[0] || '';
const appName = cameCase(appDir, { pascalCase: true });

(async () => {
  // 搜寻当前目录下游没有iflux-config.js
  const ifluxConfigFile = path.join(curDir, 'iflux.config.js');
  let config = {} as { lang: string; target: 'web' | 'rn' | 'mpapp' };

  try {
    config = require(ifluxConfigFile);
  } catch (err) {
    console.error(chalk.red('😭 当前目录不存在: iflux.config.js'));
    return;
  }

  //validate appName
  if (!appDir) {
    console.error(chalk.red('😭 请指定应用名称'));
    return;
  }

  const appPath = path.join(curDir, appDir);

  const isExisted = await fs.pathExists(appPath);
  if (isExisted) {
    console.error(chalk.red(`app:|> ${appName} 已经存在于当前的路径`));
    return;
  }

  // 创建目录
  await fs.ensureDir(appPath);
  await fs.ensureDir(path.join(appPath, 'component'));

  if (config.lang == 'ts') {
    fs.writeFile(path.join(appPath, 'index.tsx'), tsIndex({ appName })).catch(
      err => console.log(err)
    );

    fs.writeFile(path.join(appPath, 'store.ts'), tsStore({ appName })).catch(
      err => console.log(err)
    );

    fs.writeFile(
      path.join(appPath, 'component', 'text.tsx'),
      tsRelax({ relaxName: 'Text', target: config.target })
    ).catch(err => console.log(err));

    fs.writeFile(path.join(appPath, 'action.ts'), tsAction({})).catch(err =>
      console.log(err)
    );
  } else {
    fs.writeFile(path.join(appPath, 'index.js'), jsIndex({ appName })).catch(
      err => console.log(err)
    );

    fs.writeFile(path.join(appPath, 'store.js'), jsStore({ appName })).catch(
      err => console.log(err)
    );

    fs.writeFile(
      path.join(appPath, 'component', 'text.js'),
      jsRelax({ relaxName: 'Text', target: config.target })
    ).catch(err => console.log(err));

    fs.writeFile(path.join(appPath, 'action.js'), jsAction({})).catch(err =>
      console.log(err)
    );
  }
})();

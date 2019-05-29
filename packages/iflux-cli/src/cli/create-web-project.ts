#!/usr/bin/env node
import chalk from 'chalk';
import commander from 'commander';
import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';
import {
  entry,
  ifluxConfigFile,
  indexHtml,
  packagejson,
  tsconfig
} from './template/project';
import { tsAction, tsIndex, tsRelax, tsStore } from './template/ts';

const formatCode = (opts: Object) => (code: string) => {
  return prettier.format(code, opts);
};

commander.parse(process.argv);

// 获取当前的路径
const curDir = process.cwd();
// 获取当前的appName
const webName = commander.args[0] || '';
const webPath = path.join(curDir, webName);
const appPath = path.join(curDir, webName, 'src', 'home');
const componentPath = path.join(appPath, 'component');

(async () => {
  // 判断当前目录是不是已经存在webName目录
  if (await fs.pathExists(webPath)) {
    console.error(chalk.red(`😭 ${webName}已经存在`));
    return;
  }

  // 创建目录
  await fs.ensureDir(webName);
  await fs.ensureDir(appPath);
  await fs.ensureDir(componentPath);

  //set code style
  const format = formatCode({
    tabWidth: 2,
    singleQuote: true,
    printWidth: 80,
    jsxSingleQuote: true,
    jsxBracketSameLine: false,
    parser: 'typescript'
  });

  // 创建package.json
  fs.writeFile(
    path.join(webPath, 'package.json'),
    packagejson({ name: webName })
  ).catch(err => {
    console.log(err);
  });

  // 创建tsconfig.json
  fs.writeFile(path.join(webPath, 'tsconfig.json'), tsconfig()).catch(err =>
    console.log(err)
  );

  // 创建index.html
  fs.writeFile(path.join(webPath, 'index.html'), indexHtml()).catch(err =>
    console.log(err)
  );

  // 创建iflux.config.js
  fs.writeFile(
    path.join(webPath, 'iflux.config.js'),
    format(ifluxConfigFile())
  ).catch(err => console.log(err));

  // 创建 src/index.tsx
  await fs
    .writeFile(path.join(curDir, webName, 'src', 'index.tsx'), format(entry()))
    .catch(err => console.log(err));

  // 创建index.tsx
  fs.writeFile(path.join(appPath, 'index.tsx'), format(tsIndex())).catch(err =>
    console.log(err)
  );

  // 创建store
  fs.writeFile(
    path.join(appPath, 'store.ts'),
    format(tsStore({ appName: '❤️ iflux' }))
  ).catch(err => console.log(err));

  // 创建home/component/text.tsx
  fs.writeFile(
    path.join(appPath, 'component', 'text.tsx'),
    format(tsRelax({ relaxName: 'Text', target: 'web' }))
  ).catch(err => console.log(err));

  // 创建home/action.ts
  fs.writeFile(path.join(appPath, 'action.ts'), format(tsAction())).catch(err =>
    console.log(err)
  );

  console.log(chalk.green(`create ${webName} successfully 👏👏`));
  console.log(chalk.green(`1. cd ${webName}`));
  console.log(chalk.green('2. yarn => install dependencies'));
  console.log(chalk.green('3. yarn start => running'));
  console.log(chalk.green('4. yarn run build => build dist'));
})();

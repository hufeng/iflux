#!/usr/bin/env node
import chalk from 'chalk';
import commander from 'commander';
import Koa from 'koa';
import _ from 'koa-route';
import path from 'path';
import { searchAllIfluxApp } from './handler/search-all-iflux-app';

commander.parse(process.argv);
const port = Number(commander.args[0] || '3000');
// 获取当前的路径
const curDir = process.cwd();

//=============main==================
(() => {
  //@ts-ignore
  const { err, config } = findIfluxConfig();
  if (err) {
    return;
  }

  //@ts-ignore
  const app = new Koa();
  app.use(
    _.get('/', async ctx => {
      try {
        const res = await searchAllIfluxApp(curDir);
        ctx.body = {
          res,
          err: null
        };
      } catch (err) {
        ctx.body = {
          res: {},
          err
        };
      }
    })
  );
  app.listen(port);
  console.log('starting..');
})();

function findIfluxConfig() {
  // 搜寻当前目录下游没有iflux-config.js
  const ifluxConfigFile = path.join(curDir, 'iflux.config.js');
  let config = {} as { lang: string; target: 'web' | 'rn' | 'mpapp' };

  try {
    config = require(ifluxConfigFile);
  } catch (err) {
    console.error(chalk.red('😭 当前目录不存在: iflux.config.js'));
    return { err, config };
  }

  return { config, err: null };
}

#!/usr/bin/env node
import commander from 'commander';

commander
  .version(require('../../package.json'))
  .command('init', '初始化iflux的配置')
  .command('create-web [name]', '创建iflux的web项目')
  .command(
    'new [name]',
    '生成iflux的app脚手架代码 name请用小写字母，多个单词请用-隔开，如：setting, shopping-cart '
  )
  .command('serve [port]', '运行iflux服务, port默认3000')
  .parse(process.argv);

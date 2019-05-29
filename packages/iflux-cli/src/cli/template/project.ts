import { tpl } from './index';

export const entry = tpl`
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import Index from './home';

ReactDOM.render(
  <Router>
    <Route exact path="/" component={Index} />
  </Router>,
  document.getElementById('app')
);
`;

export const packagejson = tpl`
{
  "name": ${props => JSON.stringify(props.name)},
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "parcel serve index.html",
    "build": "parcel build index.html"
  },
  "dependencies": {
    "iflux": "^4.1.6",
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-router-dom": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^16.8.18",
    "@types/react-dom": "^16.8.4",
    "parcel": "^1.12.3",
    "typescript": "^3.4.5"
  }
}
`;

export const tsconfig = tpl`
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "jsx": "react",

    "strict": true,
    "noImplicitAny": false,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    "moduleResolution": "node",
    "esModuleInterop": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
`;

export const ifluxConfigFile = tpl`
module.exports = {
  lang: 'ts',    // [ts|js]. default ts,
  target: 'web'  // [web|rn|mpapp] default web
}
`;

export const indexHtml = tpl`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>I ❤️ iflux</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="./src/index.tsx"></script>
  </body>
</html>
`;

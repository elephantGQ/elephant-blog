---
title: Webpack 转 Vite 常见问题以及解决方案
date: 2022-07-02 23:02
tags:
  - Webpack
  - Vite
categories:
  - Vite
sidebar: "auto"
---

### Q1: Vite 不支持 .js 写 JSX 文件 

这个是 Vite 默认就不支持的问题，所以这里会有切合业务的两个问题:

1.  需要将所有的文件类型改写成 JSX or TSX
2.  项目模块过多，组件更多，一个个改不现实

方案一:

```js
// vite.config.js
optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup (build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
              loader: 'jsx',
              contents: await fs.readFile(args.path, 'utf8')
            }))
          }
        }
      ]
    }
  }
```

方案二:

```js
const path = require('path')
const fs = require('fs')

const dirPath = path.resolve('./src')
const readFile = (filePath) => {
  const files = fs.readdirSync(filePath)
  files.forEach((filename) => {
    const fileDir = path.join(filePath, filename)
    fs.stat(fileDir, (error, stats) => {
      if (error) {
        console.warn('获取文件stats失败', error)
      } else {
        const isFile = stats.isFile() //是文件
        const isDir = stats.isDirectory() //是文件夹
        if (isFile) {
          const content = fs.readFileSync(fileDir, 'utf-8').toString()
          const fileObj = path.parse(fileDir)
          if (fileObj.ext === '.ts' || fileObj.ext === '.js') {
            if (content.includes('React')) {
              const newFileName = fileObj.name + '.jsx'
              try {
                fs.renameSync(fileDir, path.join(fileObj.dir, newFileName))
              } catch (error) {
                console.log('error', error)
              }
            } else {
              // 不处理
              console.log(`不处理的文件 ===>>> ${fileDir}`)
              // console.log(content)
            }
          }
        }
        if (isDir) {
          readFile(fileDir) //递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
      }
    })
  })
}

readFile(dirPath)
```

### Q2: Uncaught ReferenceError: global is not defined

这是因为在浏览器中，并没有 global 这个全局属性 在 index.html 中加入

方案一: 在 index.html 入口文件上定义 global 变量

```html
// index.html
<script>
  global = globalThis
</script>
```

方案二: 在 vite.config.js 中添加 define

```js
// vite.config.js
return defineConfig({
  define: {
    global: JSON.stringify({})
    // 或
    // global: 'globalThis'
  }
})
```

### Q3: 添加别名

1.如果 tsconfig.json 项目的 baseUrl 为’src’需要增加 src 下的文件 alias

### Q4: 样式显示异常

1、检查之前是否配置了 `postcss`，目前 infra-vite 还不能同步 `postcss` 相关配置，需要手动添加。

例如，之前在 `webpack.config.js` 进行了如下配置

```js
{
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    postcssOptions: {
      plugins: [
        'postcss-inline-svg',
        [
          'postcss-preset-env',
          {
            stage: 0,
            features: {
              'nesting-rules': true,
            },
          },
        ],
      ],
    },
  },
},
```

在 `vite.config.js` 中的 `css.postcss` 改为下面配置:

```js
export default defineConfig({
  // other config
  css: {
    postcss: {
      map: true,
      plugins: [
        require('postcss-inline-svg'),
        require('postcss-preset-env')({
          stage: 0,
          features: {
            'nesting-rules': true
          }
        })
      ]
    }
  }
})
```

2、如果使用了 CSS Module 需要把 css 文件命名为 `.module.css` 为后缀的形式。在 Vite 中，任何以 `.module.css` 为后缀名的 CSS 文件都被认为是一个 CSS modules 文件。

如果不想添加后缀，可以引入 Vite 插件 `vite-plugin-load-css-module`，插件会把指定路径文件以 `.module.css` 格式引入。比如将所有 `.css` 文件以 Css module 引入可以写成如下配置。

```js
// vite.config.js
import { defineConfig } from 'vite'
import loadCssModulePlugin from 'vite-plugin-load-css-module'

export default defineConfig({
  // ...
  plugins: [
    loadCssModulePlugin({
      include: (id) => id.endsWith('.css') && !id.includes('node_modules')
    })
  ]
})
```

### Q5: 出现错误 Uncaught ReferenceError: module is not defined

删除模块热更新（或 HMR）相关代码， Vite 中默认支持 HMR。

### Q6: Failed to resolve entry for package "xxx". The package may have incorrect main/module/exports specified in its package.json.

可能由于包配置错误了错误的入口文件导致 Vite 解析失败。可以把对应包名和包的入口文件加到 `vite.config.js` 的 `resolve.alias` 中解决。例如包名 `xxx` 的入口文件为 `xxx/index.js`，可以进行如下配置。

```js
// vite.config.js
export default defineConfig({
  resolve: {
    alias: [{ find: 'xxx', replacement: 'xxx/index.js' }]
  }
})
```

### Q7: css 中解析 `~` 路径错误

> [Error: ENOENT: no such file or directory, open '/Users/project/src/components/common/~theme.module.css']

Vite 没有处理 `~` 的对应路径。可以在 `resolve.alias` 配置 `~` 对应的路径别名。

```js
// vite.config.js
export default defineConfig({
  resolve: {
    alias: [{ find: /^~/, replacement: 'src/' }]
  }
})
```

### Q8: Proxy 没有转换成功

如果代理没有在 webpack 中统一配置，而是通过 `const devServer = new WebpackDevServer(compiler, serverConfig)` 等方法创建，infra-vite 是没有办法获取并进行转换的，需要手动进行配置。配置方法

```js
// vite.config.js
server: {
  host: 'localhost',
  open: true,
  port: 3000,
  proxy: {
    '/api': {
      target: 'https://xxx.shopee.io/api/',
      changeOrigin: true,
    }
  },
},
```

### Q9: A file extension must be included in the static part of the import. For example: import(`./foo/${bar}.js`).

Vite 默认不支持动态引入，如果需要的话可以引入 Vite 插件 `vite-plugin-dynamic-import`。

```js
import dynamicImport from 'vite-plugin-dynamic-import'

plugins: [
  dynamicImport(/* options */),
],
```

### Q10: Vite 不支持 CommonJS 格式

Vite 不支持 CommonJS，项目中需要使用 ESM 语法。

> Uncaught SyntaxError: The requested module 'xxx.js' does not provide an export named 'default' (at index.ts:9:8)

需要通过 `export default` 导出，而不是 `module.exports`

> Uncaught ReferenceError: require is not defined

需要把 `require` 改成 `import` 语法。

### Q11: warning: Top-level "this" will be replaced with undefined since this file is an ECMAScript module

可以在 vite.config.js 中增加以下配置

```js
// vite.config.js
esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
```


### Q12: Uncaught TypeError: require.context is not a function

require.context 是 webpack 提供的一个能力,在 vite 中没有提供

方案一:使用 import.meta.globEager 代替

```js
const modulesFiles = require.context('./modules', true, /\.js$/) // webpack
const modulesFiles = import.meta.globEager('./module/*.js') // vite
```

方案二:使用[@originjs/vite-plugin-require-context](https://www.npmjs.com/package/@originjs/vite-plugin-require-context)插件

### Q13: 以组件的方式加载 svg

使用[vite-plugin-svgr](https://www.npmjs.com/package/vite-plugin-svgr)

```js
// vite.config.js
import svgr from 'vite-plugin-svgr'

export default {
  // ...
  plugins: [svgr()],
}

import { ReactComponent as Logo } from './logo.svg'

//如果你想
import Logo from './logo.svg'
//需要增加配置
export default {
  // ...
  plugins: [svgr(
      exportAsDefault: false,
  )],
}
```

### Q14: SVG 解析失败

> [vite] Internal server error: Cannot read properties of undefined (reading 'children')
> Plugin: vite-plugin-svgr
> File:/xxx.svg

可以尝试把 svg 中注释删除

### Q15: decorators not support

项目代码中如果使用了装饰器，比如 redux 提供的 connect 来绑定状态，形如:

```js
class Foo extends React.PureComponent {
....
}
```

decorators 语法目前不被 Vite 支持，关于这个问题，也有一个[issus](https://github.com/vitejs/vite/issues/2349)，目前没有一个好的解决办法，只能去掉 decorators，改用常规的函数绑定。

### Q16: Failed to resolve entry for package 'xxx'

部分第三方包在 package.json 里的导出位置是错误的，导致 Vite 查找的时候出现了错误。
通过 viteConfig 的 resolve 参数，强制将路径换成正确的地址。

```js
//viteConfig.js
resolve: {
  alias: [
    {
      find: 'intl-locales-supported',
      replacement: path.resolve('node_modules/intl-locales-supported/src/index.ts')
    }
  ]
}
```

### Q17: Uncaught ReferenceError: process is not defined

vite 默认只加载以 VITE\_开头的变量如果挂在在 process.env 上的变量如果不是以\_vite 开头的会被忽略
方案一:使用 import.meta.env.\* 代替

```js
process.env.DISABLE_SENTRY
//to
import.meta.env.DISABLE_SENTRY

export function getEnvVariables() {
  switch (detectBundler()) {
    case 'vite':
      return {
        DISABLE_SENTRY: import.meta.env.VITE_DISABLE_SENTRY
      }
    case 'webpack':
      return {
        DISABLE_SENTRY: process.env.DISABLE_SENTRY
      }
  }
}

function detectBundler() {
  try {
    !!import.meta.env.MODE
    return 'vite'
  } catch {}
  return 'webpack'
}
```

方案二:在 define 中定义

```js
define: {
  'process.env.uuiVersion': JSON.stringify(packageJson.version),
},
```

### Q18:Could not resolve "file-loader!pdfjs-dist/legacy/build/pdf.worker"

更改引入路径

```js
import { Page } from 'react-pdf/dist/esm/entry.webpack'
//  修改为
import { Page } from 'react-pdf'
```

### Q19: Node.js 内置变量不存在

```js
// vite.config.js

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig({
  // ...

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },

      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true
        }),

        NodeModulesPolyfillPlugin()
      ]
    }
  }
})
```


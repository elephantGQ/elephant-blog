---
title: Vue Loader
date: 2021-12-15 10:15
tags:
  - Vue 
  - vue-loader
categories:
  - Vue
sidebar: "auto"
---

##Vue Loader 是什么？ 

+   [Vue Loader](https://vue-loader.vuejs.org/zh/) 是一个 webpack 的 loader，它允许你以一种名为单文件组件 (SFCs)的格式撰写 Vue 组件

##起步 

### 安装 

```js
npm install vue --save
npm install  webpack webpack-cli style-loader css-loader html-webpack-plugin vue-loader  vue-template-compiler  webpack-dev-server --save-dev
```

### webpack.config.js 

webpack.config.js

```js
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
module.exports = {
    mode: 'development',
    devtool: false,
    entry: './src/main.js',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: true
        })
    ]
}
```

### main.js 

src\\main.js

```js
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
```

### App.vue 

src\\App.vue

```js
<script>
console.log('App');
</script>
```

### index.html 

src\\index.html

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>vue-loader</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

##loader实现 

### 文件结构 

+   vue-loader内部主要有三个部分
    +   `vue-loader\index.js` 实现了一个普通Loader,负责把SFC的不同区块转化为`import`语句
    +   `vue-loader\pitcher.js`实现pitch Loader,用于拼出完整的行内路径
    +   `vue-loader\plugin.js` 负责动态修改webpack配置，注入新的loader到rules规则中

### 基础知识 

#### LoaderContext 

+   [Loader Context](https://webpack.docschina.org/api/loaders/#the-loader-context) 表示在 loader 内使用 this 可以访问的一些方法或属性
+   [this.callback](https://webpack.docschina.org/api/loaders/#thiscallback)可以同步或者异步调用的并返回多个结果的函数

#### pitching-loader 

+   [pitching-loader](https://webpack.docschina.org/api/loaders#pitching-loader)loader 总是 从右到左被调用。在实际（从右到左）执行 loader 之前，会先 从左到右 调用 `loader` 上的 `pitch` 方法
+   loader 可以通过 request 添加或者禁用内联前缀，这将影响到 pitch 和执行的顺序,请看[Rule.enforce](https://webpack.docschina.org/configuration/module/#ruleenforce)

![loader-runner](http://img.zhufengpeixun.cn/loader-runner2.jpg)

#### Rule.enforce 

+   [Rule.enforce](https://webpack.docschina.org/configuration/module#ruleenforce)可以用于指定`loader`种类

#### resource 

+   [Rule.resource](https://webpack.docschina.org/configuration/module/#ruleresource)会匹配 resource
+   [Rule.resourceQuery](https://webpack.docschina.org/configuration/module/#ruleresourcequery)会匹配资源查询

#### contextify 

+   [contextify](https://webpack.docschina.org/api/loaders/#thisutils)返回一个新的请求字符串，尽可能避免使用绝对路径,将请求转换为可在内部使用`require`或`import`在避免绝对路径时使用的字符串

#### @vue/compiler-sfc 

+   [compiler-sfc](https://www.npmjs.com/package/@vue/compiler-sfc)用于编译Vue单文件组件的低级实用程序

```js
// main script
import script from '/project/foo.vue?vue&type=script'
// template compiled to render function
import { render } from '/project/foo.vue?vue&type=template&id=xxxxxx'
// css
import '/project/foo.vue?vue&type=style&index=0&id=xxxxxx'
// attach render function to script
script.render = render
// attach additional metadata
script.__file = 'example.vue'
script.__scopeId = 'hash'
export default script
```

### 工作流程 

![](https://static.zhufengpeixun.com/vueloader_1661567856026.jpg)

#### 原始内容 

```js
import App from './App.vue'
```

#### 第1次转换 

+   1.进入vue-loader的normal处理转换代码为
    
    ```js
    import script from "./App.vue?vue&type=script&id=4d69bc76&lang=js"
    import {render} from "./App.vue?vue&type=template&id=4d69bc76&scoped=true&lang=js"
    import "./App.vue?vue&type=style&index=0&id=4d69bc76&scoped=true&lang=css"
    script.__scopeId = "data-v-4d69bc76"
    script.render=render
    export default script
    ```
    

#### 第2次转换 

+   2.进入pitcher，不同区块返回不同内容

```js
//script区块
export { default } from "-!../vue-loader/index.js!./App.vue?vue&type=script&id=4d69bc76&lang=js"; export * from "-!../vue-loader/index.js!./App.vue?vue&type=script&id=4d69bc76&lang=js"
//template区块
export * from "-!../vue-loader/templateLoader.js!../vue-loader/index.js!./App.vue?vue&type=template&id=4d69bc76&scoped=true&lang=js"
//style区块
export * from "-!../node_modules/style-loader/dist/cjs.js!../node_modules/css-loader/dist/cjs.js!../vue-loader/stylePostLoader.js!../vue-loader/index.js!./App.vue?vue&type=style&index=0&id=4d69bc76&scoped=true&lang=css"
```

#### 第3次转换 

+   第二次执行`vue-loader`,从SFC中提取对应的区块内容，交给后面的loader
+   `script`内容直接编译返回
+   `template`内容交给`templateLoader`
+   `style`内容交给`stylePostLoader`

vue-loader\\index.js

```js
if (incomingQuery.get('type')) {
  return select.selectBlock(descriptor, id, loaderContext, incomingQuery);
}
```

##编译script 

+   第一次的时候只走`vue-loader`,返回临时文件`import script from "./App.vue?vue&type=script&id=4d69bc76&lang=js"`
+   第一次加载临时文件的时候会走`pitcher`,`pitcher`会拼出行内loader和加载模块的完整路径

### webpack.config.js 

webpack.config.js

```diff
+const { VueLoaderPlugin } = require('./vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
+const path = require('path')
module.exports = {
    mode: 'development',
    devtool: false,
    entry: './src/main.js',
    module: {
        rules: [
            {
                test: /\.vue$/,
+               loader: path.resolve(__dirname, 'vue-loader')
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: true
        })
    ]
}
```

### vue-loader\\index.js 

vue-loader\\index.js

```js
const compiler = require("vue/compiler-sfc");
const hash = require("hash-sum");
const VueLoaderPlugin = require("./plugin");
const select = require("./select");
function loader(source) {
    const loaderContext = this;
    const { resourcePath, resourceQuery = '' } = loaderContext;
    const rawQuery = resourceQuery.slice(1);
    const incomingQuery = new URLSearchParams(rawQuery);
    const { descriptor } = compiler.parse(source);
    const id = hash(resourcePath);
    if (incomingQuery.get('type')) {
        return select.selectBlock(descriptor, id, loaderContext, incomingQuery);
    }
    const code = [];
    const { script } = descriptor;
    if (script) {
        const query = `?vue&type=script&id=${id}&lang=js`;
        const scriptRequest = JSON.stringify(loaderContext.utils.contextify(loaderContext.context, resourcePath + query));
        code.push(`import script from ${scriptRequest}`);
    }
    code.push(`export default script`);
    return code.join('\n');
}
loader.VueLoaderPlugin = VueLoaderPlugin;
module.exports = loader;
```

### plugin.js 

vue-loader\\plugin.js

```js
class VueLoaderPlugin {
    apply(compiler) {
        const rules = compiler.options.module.rules;
        const pitcher = {
            loader: require.resolve('./pitcher'),
            //类似于test,用于判断资源的路径是否适用于此规则
            resourceQuery: query => {
                if (!query) {
                    return false;
                }
                let parsed = new URLSearchParams(query.slice(1));
                return parsed.get('vue') !== null;
            }
        };
        //把pitcher添加到rules数组的第一位
        compiler.options.module.rules = [pitcher, ...rules];
    }
}
module.exports = VueLoaderPlugin;
```

### pitcher.js 

vue-loader\\pitcher.js

```js
const pitcher = code => code;
const isNotPitcher = loader => loader.path !== __filename;
const pitch = function () {
    const context = this;
    const loaders = context.loaders.filter(isNotPitcher);
    const query = new URLSearchParams(context.resourceQuery.slice(1));
    return genProxyModule(loaders, context, query.get('type') !== 'template');
}
function genProxyModule(loaders, context, exportDefault = true) {
    const request = genRequest(loaders, context);
    return (exportDefault ? `export { default } from ${request}; ` : ``) + `export * from ${request}`;
}
function genRequest(loaders, context) {
    const loaderStrings = loaders.map(loader => loader.request);
    const resource = context.resourcePath + context.resourceQuery;
    return JSON.stringify(context.utils.contextify(context.context, '-!' + [...loaderStrings, resource].join('!')));
}
pitcher.pitch = pitch;
module.exports = pitcher;
```

### select.js 

vue-loader\\select.js

```js
const compiler_sfc = require("vue/compiler-sfc");
function selectBlock(descriptor, scopeId, loaderContext, query) {
    if (query.get('type') === `script`) {
        const script = compiler_sfc.compileScript(descriptor, { id: scopeId });
        loaderContext.callback(null, script.content);
        return;
    }
}
exports.selectBlock = selectBlock;
```

##编译template 

### src\\App.vue 

src\\App.vue

```js
<template>
    <h1>hello</h1>
</template>
<script>
console.log('App');
</script>
```

### vue-loader\\index.js 

vue-loader\\index.js

```diff
const compiler = require("vue/compiler-sfc");
const hash = require("hash-sum");
const VueLoaderPlugin = require("./plugin");
const select = require("./select");
function loader(source) {
    const loaderContext = this;
    const { resourcePath, resourceQuery = '' } = loaderContext;
    const rawQuery = resourceQuery.slice(1);
    const incomingQuery = new URLSearchParams(rawQuery);
    const { descriptor } = compiler.parse(source);
    const id = hash(resourcePath);
    if (incomingQuery.get('type')) {
        return select.selectBlock(descriptor, id, loaderContext, incomingQuery);
    }
    const code = [];
    const { script } = descriptor;
    if (script) {
        const query = `?vue&type=script&id=${id}&lang=js`;
        const scriptRequest = JSON.stringify(loaderContext.utils.contextify(loaderContext.context, resourcePath + query));
        console.log(scriptRequest);
        code.push(`import script from ${scriptRequest}`);
    }
+   if (descriptor.template) {
+       const query = `?vue&type=template&id=${id}&lang=js`;
+       const templateRequest = JSON.stringify(loaderContext.utils.contextify(loaderContext.context, resourcePath + query));
+       code.push(`import {render} from ${templateRequest}`);
+   }
+   code.push(`script.render=render`);
    code.push(`export default script`);
    return code.join('\n');
}
loader.VueLoaderPlugin = VueLoaderPlugin;
module.exports = loader;
```

### plugin.js 

vue-loader\\plugin.js

```diff
class VueLoaderPlugin {
    apply(compiler) {
        const rules = compiler.options.module.rules;
        const pitcher = {
            loader: require.resolve('./pitcher'),
            resourceQuery: query => {
                if (!query) {
                    return false;
                }
                let parsed = new URLSearchParams(query.slice(1));
                return parsed.get('vue') !== null;
            }
        };
+       const templateCompilerRule = {
+           loader: require.resolve('./templateLoader'),
+           resourceQuery: query => {
+               if (!query) {
+                   return false;
+               }
+               const parsed = new URLSearchParams(query.slice(1));
+               return parsed.get('vue') != null && parsed.get('type') === 'template';
+           }
+       };
+       compiler.options.module.rules = [pitcher, templateCompilerRule, ...rules];
    }
}
module.exports = VueLoaderPlugin;
```

### select.js 

vue-loader\\select.js

```diff
const compiler_sfc = require("vue/compiler-sfc");
function selectBlock(descriptor, scopeId, loaderContext, query) {
    if (query.get('type') === `script`) {
        const script = compiler_sfc.compileScript(descriptor, { id: scopeId });
        loaderContext.callback(null, script.content);
        return;
    }
+   if (query.get('type') === `template`) {
+       const template = descriptor.template;
+       loaderContext.callback(null, template.content);
+       return;
+   }
}
exports.selectBlock = selectBlock;
```

### templateLoader.js 

vue-loader\\templateLoader.js

```js
const compiler_sfc = require("vue/compiler-sfc");
const TemplateLoader = function (source) {
    const loaderContext = this;
    const query = new URLSearchParams(loaderContext.resourceQuery.slice(1));
    const scopeId = query.get('id');
    const { code } = compiler_sfc.compileTemplate({
        source,
        id: scopeId
    });
    loaderContext.callback(null, code);
}
module.exports = TemplateLoader;
```

##编译style 

### webpack.config.js 

webpack.config.js

```diff
const { VueLoaderPlugin } = require('./vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
module.exports = {
    mode: 'development',
    devtool: false,
    entry: './src/main.js',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: path.resolve(__dirname, 'vue-loader')
            },
+           {
+               test: /\.css$/,
+               use: [
+                   'style-loader',
+                   'css-loader'
+               ]
+           }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: true
        })
    ]
}
```

### App.vue 

src\\App.vue

```diff
<template>
+   <h1 class="title">hello</h1>
</template>
<script>
console.log('App');
</script>
+<style>
+.title {
+    color: red;
+}
+</style>
```

### vue-loader\\index.js 

vue-loader\\index.js

```diff
const compiler = require("vue/compiler-sfc");
const hash = require("hash-sum");
const VueLoaderPlugin = require("./plugin");
const select = require("./select");
function loader(source) {
    const loaderContext = this;
    const { resourcePath, resourceQuery = '' } = loaderContext;
    const rawQuery = resourceQuery.slice(1);
    const incomingQuery = new URLSearchParams(rawQuery);
    const { descriptor } = compiler.parse(source);
    const id = hash(resourcePath);
    if (incomingQuery.get('type')) {
        return select.selectBlock(descriptor, id, loaderContext, incomingQuery);
    }
    const code = [];
    const { script } = descriptor;
    if (script) {
        const query = `?vue&type=script&id=${id}&lang=js`;
        const scriptRequest = JSON.stringify(loaderContext.utils.contextify(loaderContext.context, resourcePath + query));
        console.log(scriptRequest);
        code.push(`import script from ${scriptRequest}`);
    }
    if (descriptor.template) {
        const query = `?vue&type=template&id=${id}&lang=js`;
        const templateRequest = JSON.stringify(loaderContext.utils.contextify(loaderContext.context, resourcePath + query));
        code.push(`import {render} from ${templateRequest}`);
    }
+   if (descriptor.styles.length) {
+       descriptor.styles.forEach((style, i) => {
+           const query = `?vue&type=style&index=${i}&id=${id}&lang=css`;
+           const styleRequest = JSON.stringify(loaderContext.utils.contextify(loaderContext.context, resourcePath + query));
+           code.push(`import ${styleRequest}`);
+       })
+   }
    code.push(`script.render=render`);
    code.push(`export default script`);
    return code.join('\n');
}
loader.VueLoaderPlugin = VueLoaderPlugin;
module.exports = loader;
```

### plugin.js 

vue-loader\\plugin.js

```diff
+const langBlockRuleResource = (query, resource) => `${resource}.${query.get('lang')}`;
class VueLoaderPlugin {
    apply(compiler) {
        const rules = compiler.options.module.rules;
        const pitcher = {
            loader: require.resolve('./pitcher'),
            resourceQuery: query => {
                if (!query) {
                    return false;
                }
                let parsed = new URLSearchParams(query.slice(1));
                return parsed.get('vue') !== null;
            }
        };
+       const vueRule = rules.find(rule => 'foo.vue'.match(rule.test));
+       const clonedRules = rules.filter(rule => rule !== vueRule)
+           .map(rule => cloneRule(rule, langBlockRuleResource));
        const templateCompilerRule = {
            loader: require.resolve('./templateLoader'),
            resourceQuery: query => {
                if (!query) {
                    return false;
                }
                const parsed = new URLSearchParams(query.slice(1));
                return parsed.get('vue') != null && parsed.get('type') === 'template';
            }
        };
+       compiler.options.module.rules = [pitcher, templateCompilerRule, ...clonedRules, ...rules];
    }
}
+function cloneRule(rule, ruleResource) {
+    let currentResource;
+    const res = Object.assign(Object.assign({}, rule), {
+        resource: resources => {
+            currentResource = resources;
+            return true;
+        },
+        resourceQuery: query => {
+            if (!query) {
+                return false;
+            }
+            const parsed = new URLSearchParams(query.slice(1));
+            if (parsed.get('vue') === null) {
+                return false;
+            }
+            //取出路径中的lang参数，生成一个虚拟路径，传入规则中判断是否满足  
+            //通过这种方式，vue-loader可以为不同的区块匹配rule规则 
+            const fakeResourcePath = ruleResource(parsed, currentResource);
+            if (!fakeResourcePath.match(rule.test)) {
+                return false;
+            }
+            return true;
+        }
+    });
+    delete res.test;
+    return res;
+}
module.exports = VueLoaderPlugin;
```

### select.js 

vue-loader\\select.js

```diff
const compiler_sfc = require("vue/compiler-sfc");
function selectBlock(descriptor, scopeId, loaderContext, query) {
    if (query.get('type') === `script`) {
        const script = compiler_sfc.compileScript(descriptor, { id: scopeId });
        loaderContext.callback(null, script.content);
        return;
    }
    if (query.get('type') === `template`) {
        const template = descriptor.template;
        loaderContext.callback(null, template.content);
        return;
    }
+   if (query.get('type') === `style` && query.get('index') != null) {
+       const style = descriptor.styles[Number(query.get('index'))];
+       loaderContext.callback(null, style.content);
+       return;
+   }
}
exports.selectBlock = selectBlock;
```

##Scoped CSS 

+   当`style`标签有[scoped](https://vue-loader.vuejs.org/zh/guide/scoped-css.html)属性时，它的 CSS 只作用于当前组件中的元素

### App.vue 

src\\App.vue

```diff
<template>
    <h1 class="title">hello</h1>
</template>
<script>
console.log('App');
</script>
+<style scoped>
+.title {
+    color: red;
+}
+</style>
```

### vue-loader\\index.js 

vue-loader\\index.js

```diff
const compiler = require("vue/compiler-sfc");
const hash = require("hash-sum");
const VueLoaderPlugin = require("./plugin");
const select = require("./select");
function loader(source) {
    const loaderContext = this;
    const { resourcePath, resourceQuery = '' } = loaderContext;
    const rawQuery = resourceQuery.slice(1);
    const incomingQuery = new URLSearchParams(rawQuery);
    const { descriptor } = compiler.parse(source);
    const id = hash(resourcePath);
    if (incomingQuery.get('type')) {
        return select.selectBlock(descriptor, id, loaderContext, incomingQuery);
    }
+    const hasScoped = descriptor.styles.some(s => s.scoped);
    const code = [];
    const { script } = descriptor;
    if (script) {
        const query = `?vue&type=script&id=${id}&lang=js`;
        const scriptRequest = JSON.stringify(loaderContext.utils.contextify(loaderContext.context, resourcePath + query));
        code.push(`import script from ${scriptRequest}`);
    }
    if (descriptor.template) {
+       const scopedQuery = hasScoped ? `&scoped=true` : ``;
+       const query = `?vue&type=template&id=${id}${scopedQuery}&lang=js`;
        const templateRequest = JSON.stringify(loaderContext.utils.contextify(loaderContext.context, resourcePath + query));
        code.push(`import {render} from ${templateRequest}`);
    }
    if (descriptor.styles.length) {
        descriptor.styles.forEach((style, i) => {
+           const scopedQuery = style.scoped ? `&scoped=true` : ``;
+           const query = `?vue&type=style&index=${i}&id=${id}${scopedQuery}&lang=css`;
            const styleRequest = JSON.stringify(loaderContext.utils.contextify(loaderContext.context, resourcePath + query));
            code.push(`import ${styleRequest}`);
        })
    }
+   if (hasScoped) {
+       code.push(`script.__scopeId = "data-v-${id}"`);
+   }
    code.push(`script.render=render`);
    code.push(`export default script`);
    return code.join('\n');
}
loader.VueLoaderPlugin = VueLoaderPlugin;
module.exports = loader;
```

### pitcher.js 

vue-loader\\pitcher.js

```diff
+const isCSSLoader = loader => /css-loader/.test(loader.path);
+const stylePostLoaderPath = require.resolve('./stylePostLoader');
const pitcher = code => code;
const isNotPitcher = loader => loader.path !== __filename;
const pitch = function () {
    const context = this;
    const loaders = context.loaders.filter(isNotPitcher);
    const query = new URLSearchParams(context.resourceQuery.slice(1));
+   if (query.get('type') === `style`) {
+       const cssLoaderIndex = loaders.findIndex(isCSSLoader);
+       if (cssLoaderIndex > -1) {
+           const afterLoaders = loaders.slice(0, cssLoaderIndex + 1);
+           const beforeLoaders = loaders.slice(cssLoaderIndex + 1);
+           return genProxyModule([...afterLoaders, stylePostLoaderPath, ...beforeLoaders], context);
+       }
+   }
    return genProxyModule(loaders, context, query.get('type') !== 'template');
}
function genProxyModule(loaders, context, exportDefault = true) {
    const request = genRequest(loaders, context);
    return (exportDefault ? `export { default } from ${request}; ` : ``) + `export * from ${request}`;
}
function genRequest(loaders, context) {
+   const loaderStrings = loaders.map(loader => loader.request || loader);
    const resource = context.resourcePath + context.resourceQuery;
    return JSON.stringify(context.utils.contextify(context.context, '-!' + [...loaderStrings, resource].join('!')));
}
pitcher.pitch = pitch;
module.exports = pitcher;
```

### stylePostLoader.js 

vue-loader\\stylePostLoader.js

```js
const compiler_sfc = require("vue/compiler-sfc");
const StylePostLoader = function (source) {
    const query = new URLSearchParams(this.resourceQuery.slice(1));
    const { code } = compiler_sfc.compileStyle({
        source,
        id: `data-v-${query.get('id')}`,
        scoped: !!query.get('scoped')
    });
    this.callback(null, code);
};
module.exports = StylePostLoader;
```

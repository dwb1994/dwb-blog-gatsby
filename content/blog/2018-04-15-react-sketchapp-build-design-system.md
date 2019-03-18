---
title: 使用 React 管理你的设计资产
date: 2018-04-15
tags: [design, 规范, 团队协作]
photos: [https://ws1.sinaimg.cn/large/006oPFLAly1fqqby6sujqj31hc0sg7ei.jpg]
type: blog
---
# 使用 React 管理你的设计资产

## 前言

最近在整理设计规范的过程中，尝试使用了 Airbnb 公司发布的 [react-sketchapp](https://github.com/airbnb/react-sketchapp) 工具，感觉非常好用，在这里墙裂推荐一哈，顺便聊一聊使用过程中的体会：

这是一个使用 React 生成 Sketch 文件的命令行工具，主要用于生成设计系统(design system)，**简单来说就是使用 `代码` 生成 `设计稿` **。这个跨界的工具提供了一种很新颖的思路，在某些特定情况下有其应用场景。

设计师同学们可能不了解 React，如果你们想了解一点点编程的话，从这个工具开始学习，可能是一个很好的入口 😁

## 为什么要用代码生成设计稿
用代码生成设计稿是一种新颖的思路，那么为什么要这样做呢？这样做有什么好处？官方是这样介绍的：

> Managing the assets of design systems in Sketch is complex, error-prone and time consuming. Sketch is scriptable, but the API often changes. React provides the perfect wrapper to build reusable documents in a way already familiar to JavaScript developers.

简言之：**代码可以更好地控制设计资产的版本迭代**。这也是我们使用这个工具的核心原因：设计资产的稳定迭代能够提高设计师与零设计团队的工作效率。

在设计规范逐渐复杂时，对规范的版本迭代变得越来越难。以往设计师需要手动去修改规范，这样往往容易出错，而且速度比较慢，尤其是制作一些重复性较强的内容的时候，例如调色板上面可能会有上百种颜色，这些色彩可能会频繁调整。

除此以外，使用代码生成设计稿还有一些优点：
1. 代码可以方便地输出重复性的视图
2. React-sketchapp 这个工具使用 React 的语法，有利于程序上的复用，包括组件代码及其样式。个人感觉写起来很像 React Native
3. 使用真实数据或组件生成设计稿，这将使设计稿与最终产出的页面更接近
4. 基于 Sketch 定制一些效率工具，举个栗子：**通过简单的配置生成完整设计规范**

## 如何使用？

### 快速上手

上手 react-sketchapp 很简单，首先确保你已经安装了 43 及以上版本的 sketch，确保安装了 npm。

然后在终端中执行下面两句命令：

``` bash
git clone https://github.com/airbnb/react-sketchapp.git // 从 github 上将 react-sketchapp 项目克隆到本地
cd react-sketchapp/examples/basic-setup // 进入项目的 /examples/basic-setup 目录
npm install // 安装 npm 依赖
```

安装完成后**新建一个 sketch 文件**，这里注意一定要**新建文件**，react-sketchapp 会在当前**最新**打开的 sketch 文件进行输出！

然后在终端中输入下面这条命令并执行（执行后请不要关闭终端窗口）：

``` bash
npm run render
```

在 sketch 文件中看到下图的样子说明配置成功：

![](https://ws1.sinaimg.cn/large/006oPFLAly1fqg3cdlfs9j31js0v0474.jpg)

用编辑器打开 react-sketchapp 目录，里面 /examples/basic-setup/src/my-command.js 就是上图的代码，现在可以复制官方给的一段示例代码到这个文件中简单地看下效果：

``` jsx
import React from 'react';
import { render, Text, Artboard } from 'react-sketchapp';

const App = props => (
  <Artboard>
    <Text style={{ fontFamily: 'Comic Sans MS', color: 'hotPink' }}>
      {props.message}
    </Text>
  </Artboard>
);

export default (context) => {
  render(<App message="Hello world!" />, context.document.currentPage());
}
```

点击保存，sketch 文件会自动刷新，刷新后是下图的效果：

![](https://ws1.sinaimg.cn/large/006oPFLAly1fqg3ky8d5qj318g0loq7m.jpg)

### 使用 API

react-sketchapp 提供了全面的 API，包含了绝大部分 sketch 的功能

首先打开 [API 文档地址](http://airbnb.io/react-sketchapp/docs/API.html#document), 左侧的 **API Reference** 就是 API 列表，这里面我常用的 API 有：

- Document: sketch 文档
- Page: 页面
- Artboard: 画板
- Image: 图像
- Text: 文字
- View: 文件夹（矩形），类似 React Native 中的 View 组件
- StyleSheet: react-sketchapp 封装了一些样式的函数，使用它可以更好的复用代码
- TextStyles: 共享文本样式

使用这些组件的时候，需要在文件顶部进行 API 的引用，以逗号分隔，不引入则会报错：

``` jsx
import { Document, Page, Artboard , ... } from 'react-sketchapp';
```

现在来尝试组合使用上述 API，输出一个页面：

``` jsx
import React from 'react';
import { render, Document, Page, Artboard, View, Text, Image } from 'react-sketchapp';

const App = props => (
  <Document>
    <Page>
      <Artboard name="ymfe.org">
        <View name="box" style={{ width: 140, height: 140, backgroundColor: '#333' }}>
          <Text name="title" style={{ color: '#fff' }}>Hello</Text>
          <Image source="https://ws1.sinaimg.cn/large/006oPFLAly1fqg4tqz7d2j30be06mjrl.jpg" style={{ height: 120, width: 140 }} />
        </View>
      </Artboard>
    </Page>
  </Document>
);

export default (context) => {
  render(<App/>, context.document.currentPage());
}
```

上述案例的输出结果是：

![](https://ws1.sinaimg.cn/large/006oPFLAly1fqg4z3eol9j318g0saq94.jpg)

除了上述这些基本功能，react-sketchapp 甚至还可以输出 Symbol，例如如下代码：

``` jsx
import React from 'react';
import { render, View, Artboard, makeSymbol } from 'react-sketchapp';
const BlueSquare = () => (
  <View
    name="Blue Square"
    style={{ width: 100, height: 100, backgroundColor: 'blue' }}
  />
);

const BlueSquareSymbol = makeSymbol(BlueSquare);

const Main = () => (
  <Artboard>
    <BlueSquareSymbol />
  </Artboard>
);

export default (context) => {
  render(<Main />, context.document.currentPage());
}
```
执行后输出结果是：

![](https://ws1.sinaimg.cn/large/006oPFLAly1fqg4bqnuu8j30k409kt99.jpg)

这将带来更大的可能性：**直接用代码输出完整 UI Kit 模板文件**

## 我们的实践

我们根据一系列色彩、字号参数，使用 react-sketchapp 制作了设计规范的调色板、文字规范及项目色彩规范。

由于开发的项目独立性较强，有些项目需要进行一定的定制（一般是字号、颜色），因此基于 **顶级设计规范** 来制定 **项目设计规范**，我们在 [YDoc - 优雅的文档站构建工具](https://ydoc.ymfe.org/) 中率先使用了导出的项目设计规范，并严格执行，取得了不错的效果：

有兴趣同学可以查看 [YDoc 项目规范文件](https://ydoc.ymfe.org/standard/style-guide.html#ydoc-%E9%A1%B9%E7%9B%AE%E8%AE%BE%E8%AE%A1%E8%A7%84%E8%8C%83-%E9%A1%B9%E7%9B%AE%E8%A7%84%E8%8C%83%E6%96%87%E4%BB%B6) , 完全用 react-sketchapp 输出的 sketch 文件：

![](https://ws1.sinaimg.cn/large/006oPFLAly1fqg5gc8g3uj328018qqhk.jpg)

## 进一步思考

### 1. 零设计团队需要设计规范吗

国内很多团队缺少设计师，或者设计资源不够充足，往往需要程序员直接上手进行设计（尤其是中后台系统），这时程序员就会跟着感觉走，写出丑陋的页面甚至难以维护的代码。缺乏规范的页面即使使用了美观的 UI 库也会成为东施效颦，不伦不类。

因此对于这样的团队来说，程序员学习一些设计规范的基本使用方式，将会大大改善这一情况：遵循一定的设计规范进行设计将会快速提高这些页面的颜值，工具赏心悦目，使用者使用起来工作也会很开心。

### 2. 效率工具

前面提到了 React-sketchapp 可以基于 Sketch 定制一些效率工具，这其实带来了无限的可能性：

这些工具的输入可以是非常简单的一些配置项，例如产品的颜色、文本大小等，而这些工具的最终产物可能是 Sketch 文件、PDF文件、也可能是代码或图片，其中 Sketch 文件可用于生成设计规范，提供给设计师进行业务组件的二次设计；PDF 可以直接用于浏览打印；图片可以单独使用，也能够以 `案例图` 的形式存在。

React-sketchapp 只是提供了一个思路，打通程序与设计后，诸如此类的工具还有非常大的空间等待挖掘。

### 3. 关于程序员使用设计工具

由于程序学习成本很高，我们仅在自研项目中做了这样的尝试，因此在设计稿中经常会看到一些工程师思维 😂

在设计规范的制作中，我们团队遇到了这样一种情况：有同学进行了一次有趣的尝试，将 JavaScript 中 `原型链(prototype)` 的思想应用到 Sketch 的 Symbol 中，由于 Symbols 中很多组件都类似，因此相似组件继承自同一个 Symbol 而只改变文本颜色、边框、背景色等属性，如下图：

![](https://ws1.sinaimg.cn/large/006oPFLAly1fqg5nse1i4j31q20tun3j.jpg)

此外，还将常用属性制作成配置项，只需进行选择即可修改组件样式：

![](https://ws1.sinaimg.cn/large/006oPFLAly1fqg5tsnjqkj31b00qc44d.jpg)

这些优化其实有点过度封装了：

- 前者原型链模式可读性太差，设计师很难理解，但是可以**把原型写到程序里，在 sketch 设计稿中隐藏这一概念**，这样既有利于维护设计稿，又利于 sketch 文件的使用；
- 后者封装的配置项过于死板，不够灵活：实际开发中设计师往往将设计稿中的组件分离，对属性逐个调整，而我们预设的配置项往往无法满足各式各样的需求，反而会增加设计稿的制作成本。

## 总结：

用代码控制设计规范的迭代，是一个很新颖的想法，在设计与技术之间跨界，实现难度比较大。react-sketchapp 这个工具提供了很多可能性，让艺术与技术能够更紧密地联系起来，让技术可以为艺术提供更好的支持。

我们尚在摸索中前行，做了一些大胆的尝试，就让时间证明它创造的价值吧 👻
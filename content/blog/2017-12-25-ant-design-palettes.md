---
title: Ant Design 色板生成算法演进之路
date: 2017-12-25
tags: [design, 规范, 团队协作]
photos: [https://ws1.sinaimg.cn/large/006oPFLAly1fmsct1vx9vj31hc0zf7ri.jpg]
type: blog
---
# Ant Design 色板生成算法演进之路

## 前言

最近我在整理一套团队内部使用的设计规范，其中颜色部分参考了 Ant Design 的 [“色彩”](https://ant.design/docs/spec/colors-cn) 部分，恰逢 Ant Design 发布了 3.0 版本，调色板做了调整，借此机会我学习了一下 Ant Design 迄今为止三个版本色板生成算法的源码，感觉其“确定”设计思想非常值得学习。

“确定” 作为 Ant Design 的设计理念之一，在调色板这一隅发挥得淋漓尽致：用科学定义设计，在设计有迹可循的同时提高了代码的可维护性，减少开发阶段样式代码的不确定性。

Ant Design 三个大版本的色板生成算法各不相同，却一直在完善，本文对其三个版本的色板生成算法进行解读，聊一聊我的体会。

在本文中我会使用一些名词，如果你不知道这些词的含义建议先简单了解一下：

- [色相、饱和度、明度](https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4)
- [HSL和HSV色彩空间](https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4)
- [贝塞尔曲线扫盲](http://www.html-js.com/article/1628)

## 关于调色板

### 什么是调色板

> 在电脑图形学中，调色板（英语：Palette）要么是指用于数字图像管理的给定有限颜色组（颜色表），要么是显示屏上一组有限选择的小图形单元（诸如“工具选板”）。
> 
> 引用自维基百科 [调色板 (电脑图形学)](https://zh.wikipedia.org/wiki/%E8%AA%BF%E8%89%B2%E7%9B%A4_(%E9%9B%BB%E8%85%A6%E5%9C%96%E5%BD%A2%E5%AD%B8))

调色板本来是混合各种颜色颜料使用的板，在 Ant Design 中，调色板指的是一份颜色表（如下图），颜色表由一系列具有一定代表性的基本色彩及它们的渐变色组成，我们可以在调色板中寻找需要的颜色并获取颜色值。

![Ant Design 调色板的一部分](https://ws1.sinaimg.cn/large/006oPFLAly1fmrzdewgzzj30mh0f840i.jpg)

### 怎样使用调色板

设计师与程序员都需要使用调色板工具，以 Ant Design 为例，设计师需要根据调色板上的色值来进行设计稿的制作，而程序员在缺乏设计稿的时候也可以直接在调色板上取色。

一般来说在进行设计稿制作的时候，直接使用 Ant Design 的一种基本色彩或与基本色彩相近的颜色作为主色，主色的渐变色可以用于组件的特殊状态，如 hover/active 状态。

### 如何制作调色板

Ant Design 的调色板由一系列具有一定代表性的基本色彩及它们的渐变色组成，其中基本色彩可以由主设计师来钦定，其渐变色由色板生成算法计算得到。

## Ant Design 1.x 色板生成算法

[Ant Design 1.x 色彩部分](http://1x.ant.design/docs/spec/colors)，第一版的实现较为简单，这部分主要介绍了：

- 对颜色部分进行了简要的说明
- 提供了一套调色板，并介绍了每种颜色的含义，但不能直接复制色值
- 提供了交互指引，介绍了色板生成工具的使用方法
- “色彩识别”部分，用简单的标签数值计算来确定对比度是否符合要求，这对于新人的使用特别友好

### 原理

选取一个主色作为 5 号色,

将主色与纯白色(#fff)混合，主色与纯白色之间分成 100 份， 20/40/60/80 的位置分别分割，得到 4/3/2/1 号色;

将主色与纯黑色(#000)混合，主色与纯黑色之间分成 100 份， 20/40/60/80 的位置分别分割，得到 6/7/8/9 号色;

通过以上方式得到一条完整渐变色板。

Ant Design 将这一版本的色板生成算法称之为 “tint/shade 色彩系统”。

### 实现

这一版本我在 github 上没看到色彩生成算法的代码，后来我 google 到了这篇文章：[Tint and Shade Functions](https://css-tricks.com/snippets/sass/tint-shade-functions/)，作者认为单纯通过改变颜色亮度实现颜色的渐变效果并不理想，于是实现如下：

```
// 变亮
@function tint($color, $percentage) {
    @return mix(white, $color, $percentage);
}
// 变暗
@function shade($color, $percentage) {
    @return mix(black, $color, $percentage);
}
// 使用
.useage {
    background-color: tint(#2db7f5, 80%);
}

```
使用了 sass 的 mix 方法来进行颜色值的混合，只需传入主色色值和百分比即可，使用 less 同理。

### 评价
这一版的实现简单粗暴，在研究颜色色彩之前，我对渐变色板的第一想法也是这样的实现，后来通过一些调研发现这样实现并不好：

1. **自然界中几乎没有纯白/纯灰/纯黑色的东西**，因此在 WEB 中使用这三种颜色给人的感觉不真实，在生成渐变色板的时候每一种主色都在向着“不真实”的终点进行过渡，这当然是不妥的；
2. 当主色亮度或饱和度过低的时候，色号小于 5 / 大于 5 的变化速率差异增大，这在开发的时候渐变色的与主色的对比度可能会失衡，视觉效果不好。

## Ant Design 2.x 色板生成算法

[Ant Design 2.x 色彩部分](http://2x.ant.design/docs/spec/colors-cn)，相对于第一版，第二版的调色板的颜色过渡更加平滑，提供了点击调色板复制颜色值的功能。

### 原理

> 经过设计师和程序员的精心调教，结合了色彩加白、加黑、加深，贝塞尔曲线，以及针对冷暖色的不同旋转角度，得出一套色板生成算法（用以取代我们原来的 tint/shade 色彩系统）。使用者只需指定主色，便可导出一条完整的渐变色板。

最初一看这个原理赶紧很复杂，其实不是那么难以理解：

1. 选取一个颜色作为主色(6 号色)；
2. 判断减淡或加深，进行颜色混合
  - 若减淡，则主色与纯白色(#fff)混合，根据色号，获取贝塞尔曲线上的对应值。
  - 若加深，则主色与**它对应的深色**混合，根据色号，获取贝塞尔曲线上的对应比例值。加深时主色对应的深色进行了明度与色相的调整，其中对色相的调整也就是上述引用中说的“针对冷暖色的旋转”；
3. 分别取1~9色号的色值，得到一条完整渐变色板。

### 实现

[源码](https://github.com/ant-design/ant-design/blob/2.x-stable/components/style/color/colorPalette.less)

核心代码：

``` js
var primaryEasing = colorEasing(0.6);
this.colorPalette = function(color, index) {
  var currentEasing = colorEasing(index * 0.1);
  // return light colors after tint
  if (index <= 6) {
    return tinycolor.mix(
      '#ffffff',
      color,
      currentEasing * 100 / primaryEasing
    ).toHexString();
  }
  return tinycolor.mix(
    getShadeColor(color),
    color,
    (1 - (currentEasing - primaryEasing) / (1 - primaryEasing)) * 100
  ).toHexString();
};
```

使用了一个叫 [tinycolor](https://github.com/bgrins/TinyColor#color-utilities) 的库， mix 方法与上面介绍的 mix 方法类似，也是传入三个参数：(目标色值，初始色值，比例)，不同的是第三个参数是 0-100 的一个数字，因此计算比例后还需 *100 来符合参数单位要求。

这里的 colorEasing 使用了另一个库 [bezier-easing](https://github.com/gre/bezier-easing/blob/master/src/index.js) 用于建立一条贝塞尔曲线并从中取值，在源码中我看到了获取贝塞尔曲线的四个参数为 **(0.26, 0.09, 0.37, 0.18)**，生成的曲线如下图，基本上与 k=1 的曲线区别不大，我觉得作者可能是想调整的是1号色、2号色这样的浅色更浅，其实这样的调整很细微，达到一个大家都满意的色值即可(即文档里说的“经过设计师和程序员的精心调教”)：

<img src="https://ws1.sinaimg.cn/large/006oPFLAly1fms7qkkvz6j30ig0j4dh3.jpg" style="width: 332px;">

与浅色混合依然与纯白色混合，但与深色混合的时候与 1.x 版本不同，没有使用纯黑，而是区别冷暖色进行不同程度的加深与色相值的旋转：2.x 版的色板使用了 **HSL** 模型，“旋转”这个词很有趣：在 HSL 模型中 “H” 表示色相，即色彩名称，下图是 HSL 模型的 3D 模型图，可以看到图 (a) 中 HSL 圆柱坐标系中，绕圆柱中轴线旋转的角度（Hue 色相值）就是颜色种类的调整：

<img src="https://ws1.sinaimg.cn/large/006oPFLAly1fmt49rl7bbj30m80brwfo.jpg" style="width: 400px;"/>

``` js
var warmDark = 0.5;     // warm color darken radio
var warmRotate = -26;  // warm color rotate degree
var coldDark = 0.55;     // cold color darken radio
var coldRotate = 10;   // cold color rotate degree
// 暖色，则旋转 HSL 色轮，使颜色更暖
if (shadeColor.toRgb().r > shadeColor.toRgb().b) {
  return shadeColor.darken(shadeColor.toHsl().l * warmDark * 100).spin(warmRotate).toHexString();
}
// 冷色，则旋转 HSL 色轮，使颜色更冷
return shadeColor.darken(shadeColor.toHsl().l * coldDark * 100).spin(coldRotate).toHexString();
```

1. 首先判断冷暖色，RGB模型中，红色是暖色，蓝色是冷色，绿色是中性色，因此用 r 与 b 的值判断冷暖色；
2. 然后根据冷暖色进行不同程度的加深与色相值的旋转。

### 评价

Ant Design 2.x 使用了 HSL 模型、贝塞尔曲线等复杂的逻辑对色彩进行渐变，得到完整的渐变色板，相比 1.x 版本来说，色彩过渡更加平滑，添加了冷暖色的细节处理。但实现逻辑较为复杂，难以理解，事实上作者也在[代码注释](https://github.com/ant-design/ant-design/blob/2.x-stable/components/style/color/colorPalette.less#L4)里开了个玩笑说没人看得懂(他还卖上萌了)：

```
// We create a very complex algorithm which take the place of original tint/shade color system
// to make sure no one can understand it 👻
```
其实 2.x 的算法也有一些缺憾：与 1.x 版本相同，我不认为应该以纯白色作为浅色渐变的终点；实现算法过于复杂，难以维护。

## Ant Design 3.x 色板生成算法

[Ant Design 3.x 色彩部分](http://2x.ant.design/docs/spec/colors-cn)，相对于第二版，增加了几种主色，整个色板的饱和度更高，色板生成算法进行了重构，不再使用贝塞尔曲线。

### 原理

Ant Design 3.x 使用了 **HSV** 模型，对于 HSV 还是 HSL 更适合于人类用户界面是有争议的，这里不做讨论。

3.x 版本没有继续使用与某个浅色/深色值进行混合的形式获取渐变色板，而是直接用 HSV 模型的值进行递减/递增得到完整渐变色板，不知为何 HSL 更换成 HSV ，可能是便于计算。

### 实现

[源码](https://github.com/ant-design/ant-design/blob/master/components/style/color/colorPalette.less)

3.x 色板生成算法的实现很简洁优雅：

```
function main(color, index) {
    var isLight = index <= 6;
    var hsv = tinycolor(color).toHsv();
    var i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1;
    // i 为index与6的相对距离
    console.log(hsv)
    return tinycolor({
        h: getHue(hsv, i, isLight),
        s: getSaturation(hsv, i, isLight),
        v: getValue(hsv, i, isLight),
    }).toHexString();
};
```

根据颜色值、色号与主色色号(6)差的绝对值、减淡/加深这三个参数获取渐变后的色值，其中 HSV 的三个值分别经过了渐变调整：

``` js
// getHue 获取色相渐变
var hueStep = 2;
if (hsv.h >= 60 && hsv.h <= 240) {
    // 冷色调
    // 减淡变亮 色相顺时针旋转 更暖
    // 加深变暗 色相逆时针旋转 更冷
    hue = isLight ? hsv.h - hueStep * i : hsv.h + hueStep * i;
} else {
    // 暖色调
    // 减淡变亮 色相逆时针旋转 更暖
    // 加深变暗 色相顺时针旋转 更冷
    hue = isLight ? hsv.h + hueStep * i : hsv.h - hueStep * i;
}
```
“Hue”(色相)的渐变核心代码如上，首先判断冷暖色调，与 2.x 版本不同的是，不再根据 rgb 中 r 与 b 的大小关系判断冷暖色调，而是根据 Hue 色相判断，对于冷暖色调在减淡与加深的时候进行不同的处理，如冷色调减淡的时候变亮的同时色相更暖，这样更符合人们对于色彩的认知：

<img src="https://ws1.sinaimg.cn/large/006oPFLAly1fmsaiort07j30e40c077h.jpg" style="width: 254px;">

``` js
// getSaturation 获取饱和度渐变
var saturationStep = 16;
var saturationStep2 = 5;
var darkColorCount = 4;
if (isLight) {
    // 减淡变亮 饱和度迅速降低
    saturation = Math.round(hsv.s * 100) - saturationStep * i;
} else if (i == darkColorCount) {
    // 加深变暗-最暗 饱和度提高
    saturation = Math.round(hsv.s * 100) + saturationStep;
} else {
    // 加深变暗 饱和度缓慢提高
    saturation = Math.round(hsv.s * 100) + saturationStep2 * i;
}
```
“Saturation”饱和度的渐变核心代码如上，对于减淡与加深的饱和度进行了不同的处理，其中减淡递减的值更大，说明减淡的过程中饱和度迅速下降，而由于主色的饱和度一般较高，因此加深的时候饱和度不必增张过快，尤其是最深的颜色，进行了特殊处理，使得 9 号色与 10 号色的饱和度相差无几。

``` js
// getValue 获取明度渐变
var brightnessStep1 = 5;
var brightnessStep2 = 15;
var getValue = function (hsv, i, isLight) {
    if (isLight) {
        // 减淡变亮
        return Math.round(hsv.v * 100) + brightnessStep1 * i;
    }
    // 加深变暗幅度更大
    return Math.round(hsv.v * 100) - brightnessStep2 * i;
};
```
“Value”明度的渐变核心代码如上，对于减淡与加深的明度进行了不同的处理，其中加深递减的值更大，说明加深的过程中明度迅速下降，这是由于主色的明度一般较高，因此减淡的时候明度不宜增长过多。

### 评价

综合来看 3.x 色板生成算法的实现可以看到，主色的选取很重要，一般主色选取饱和度较高、明度较高的颜色才能更好地匹配这个色板生成算法。

3.x 版本舍弃了与某个浅色/深色值进行混合的形式获取渐变色板的方式，而是直接对 HSV 的三个值进行递减/递增，这样做使得代码容易理解，但是也有一些弊端，比如上面提到了，饱和度递减的值/明度递减的值很大，这对于**主设计师**对主色的正确选取的要求很高：

  - 如果主色的饱和度过低，则渐变色板减淡的部分饱和度迅速递减，1/2/3色号相差无几，而加深部分饱和度增长缓慢显得色板不够饱和(如下图左侧)；
  - 如果主色的明度过低，则渐变色板加深的部分明度迅速递减，9/10色号相差无几，而减淡部分由于明度增长缓慢显得颜色过深(如下图右侧)：

<img src="https://ws1.sinaimg.cn/large/006oPFLAly1fmsbhrbbowj30vo0p6q5b.jpg" style="width: 570px;">

## Ant Design 色板生成算法现存的问题
虽然经历了几个版本的迭代，但是我还是觉得不够完美，有可能是 Ant Design 本身不完善，也有可能是我理解得不到位，暂时记录在这里供大家讨论：

- Ant Design 文档介绍说，第 6 格色彩单元格普遍满足4.5:1 最小对比度（AA 级），但是我发现部分主色的相对对比度不满足 4.5:1 标准，比如色号同为 6 的酱紫与日出(黄色)两种颜色，黄色的对比度过低导致文本难以识别：

  <img src="https://ws1.sinaimg.cn/large/006oPFLAly1fmsbxu44rcj30fe04oaaf.jpg" style="width: 227px;">

  > 注：在由浅至深的色板里，第 6 格色彩单元格普遍满足 WCAG 2.0 的 4.5:1 最小对比度（AA 级），我们将其定义为色板的默认品牌色。

- 同色号的不同颜色差异过大，尤其经过渐变色板放大这个差异后，是否不再适合搭配使用？例如下图中同色号的酱紫色的明度低于日出色(黄色)：
  <img src="https://ws1.sinaimg.cn/large/006oPFLAly1fmsc53v6qfj30th04swer.jpg" style="width: 530px;">

## 感悟

Ant Design 一直在探索更优雅的色板生成算法，经历几次迭代后发展越来越好。作为前端工程师，我很欣喜地看到技术对于用户体验优化的实践，很欣赏这种科学定义设计的方式。路漫漫其修远兮，吾将上下而求索，希望前端对于用户体验能有更多的思考与实践。
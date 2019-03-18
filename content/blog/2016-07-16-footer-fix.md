---
title: 页脚固定在浏览器底部的几种方式
date: 2016-07-16
tags: [layout]
photos: [https://ws1.sinaimg.cn/large/006cGJIjly1g12qsjybsxj31hc0x8ncj.jpg]
type: blog
---

页脚固定在浏览器底部很常见的效果，我们一般把页面备案信息、联系方式、友情链接等内容放在页面底部，同时我们希望页脚在页面内容(高度)比较短的时候固定在页面底部，在页面内容(高度)比较长的时候滚动到底部才能看到页脚。

下面介绍两种比较好的方式：

一、使用position定位footer
``` html
<style>
html, body {
height: 100%;
}
.main {
min-height: 100%;
height: auto !important;
height: 100%;
margin-bottom: -4em;
background-color: #ddf;
}
.footer, .push{
height: 4em;
}
.push{
background-color: #cff;
}
.footer{
background-color: #cfd;
}
</style>

<div class="main">
    <div class="text"><p>正文</p>
</div>
<div class="footer">footer</div>
</div>

```

设置.text的padding-bottom防止窗口高度缩小时footer与 .text 部分重合。

这里要注意一点，height:100%是相对于其父级元素高度的100%，很多时候我们设置height为100%实际上没达到预期的效果是因为其父级元素并不是100%的高度，因此这里我们要从.main往上，包括body、html都设置100%的高度。

注意position的绝对与相对定位的使用，不要弄混。



二、不使用position定位
``` html
<style>
*{margin: 0; padding: 0;}
html, body {
    height: 100%;
}
.main {
    min-height: 100%;
    height: auto !important;
    height: 100%;
    margin-bottom: -4em;
    background-color: #ddf;
}
.footer, .push{
    height: 4em;
}
.push{
    background-color: #cff;
}
.footer{
    background-color: #cfd;
}
</style>

<div class="main">
  <p>正文</p>
  <p>正文</p>
  <p>正文</p>
  <p>正文</p>
  <p>正文</p>
  <div class="push">用一个.push元素把footer“挤”下去，以防止高度过小时，.main与footer重合。</div>
</div>
<div class="footer">footer</div>
```
设置负的margin-bottom值，为footer留下高度空间，然后用一个.push元素把footer“挤”下去，以防止高度过小时，.main与footer重合。

注意这里的push元素虽然用得很巧妙，但是并无语义，最好做好代码注释以提高可维护性，也可以用伪元素取而代之。

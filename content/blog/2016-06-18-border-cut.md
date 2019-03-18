---
title: 几种截取部分border的方法
date: 2016-06-18
tags: [layout]
photos: [https://ws1.sinaimg.cn/large/006cGJIjly1g12qsaek6dj31hc0qo43a.jpg]
type: blog

---

在最近项目的一个列表中有这样一个细节，设计稿就是上面这样的：↑

这里的每行中间都会有一条1px的横线，有时候我们不希望横线填满100%的宽度，那么怎么做呢？



## 一、每条横线单独写一个div，div的高度设置1px，宽度设置95%或者其他值

这样做好处是比较直观，坏处是会使HTML结构比较乱，不利于维护，对于seo来说这个div也没有语义。



## 二、给列表的父级元素设置padding-left的值

这样做少些了很多代码，只用一句就使所有列表项右移一段距离，然后每个列表项设置border-top或者border-bottom就可以实现这个效果。

这样做的好处就是少些代码，代码逻辑清晰，也有不好的地方：

1.列表里如果有内外边距，计算时要算到父级元素的padding-left，计算比较麻烦；

2.如果列表项可以展开，可能出现下面这样的情况：
![](https://ws1.sinaimg.cn/large/006cGJIjly1g12rtmeetoj30ak034a9u.jpg)

左侧会空出 一部分空间，这时我们可以用负的margin-left值来移动下面灰色的展开项，使其对其到屏幕左侧。

3.列表项的DOM元素会丢失一部分，也就是左侧的内边距，比如列表项有点击事件监听的话，点击左侧区域是无效的：

![](https://ws1.sinaimg.cn/large/006cGJIjly1g12s0nb16kj30ay061jr7.jpg)

## 三、使用伪元素选择器

``` css
.item:after{
    content: "";
    position: absolute;
    top: -1px;
    left: 0;
    height: 1px;
    width: 30px;
    background-color: #FFFFFF;
}
```

在item前面(:before)或者后面(:after)添加一个伪div元素，实际这个元素不占据DOM结构，把这个元素绝对定位到border上面，覆盖掉一部分border。

![](https://ws1.sinaimg.cn/large/006cGJIjly1g12rzbpcwnj30e1044a9w.jpg)

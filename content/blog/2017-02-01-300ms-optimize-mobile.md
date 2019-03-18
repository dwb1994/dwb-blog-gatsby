---
title: 移动端300ms延迟解决方案及其优化
date: 2017-02-01
tags: [性能优化, Mobile]
photos: [https://ws1.sinaimg.cn/large/006cGJIjly1g12nrr5mbhj31hc0zkwns.jpg]
type: blog

---

移动端的click事件存在300ms延迟，这是为“双击放大”的效果提供一个反应时间，即300ms内双击屏幕放大页面，两次点击间隔超过300ms时不放大页面。

但是这种效果的体验不好，在不需要用户双击放大的时候，click事件会在300ms后执行，给用户一种反应迟钝的感觉，那么如何消除这300ms延迟的影响呢？

## 方案一

设置viewport的user-scalable：no，禁止用户手动缩放页面，则使用click事件不会产生延迟。

``` html
<meta name="viewport" content="user-scalable=no">
```

但是这样设置页面就无法缩放了，有时这个功能还是有必要存在的。

## 方案二

首先分析一下：HTML5中新增了移动端的触摸事件，我们可以用其中的touchstart、touchmove和touchend事件来模拟点击的过程，由于touch相关事件没有延迟，因此用来模拟click事件可以解决300ms延迟的问题。

梳理一下实现思路：
我们要模拟的click事件，是在这个DOM（或冒泡到这个DOM）上手指触摸开始，且手指未曾在屏幕上移动（某些浏览器允许移动一个非常小的位移值），且在这个dom上手指离开屏幕，且触摸和离开屏幕之间的间隔时间较短（某些浏览器不检测间隔时间，也会触发click）才能触发。

事件的触发顺序是：touchstart早于touchend早于click。

为了统一浏览器间差异：

1.用touchmove检测手指移动的距离，超过设定的值则不触发click事件；

2.如果touchstart与touchend间隔时间过长，则不触发click事件。

理清思路后，开始具体实现：


``` javascript
function onTap(element, handler){
    element = document.querySelectorAll(element)[0]; // 获取元素
    var initX, initY, movedX, movedY, distance, startTime, delay;
    // 监听touchstart事件
    element.addEventListener('touchstart', function(e){
        startTime = Date.now(); // 记录touchstart的时间戳
        distance = 0; // 初始化手指移动距离
        initX = e.changedTouches[0].clientX; // 初始化touchstart时的X/Y坐标
        initY = e.changedTouches[0].clientY;
        // 监听touchmove事件
        element.addEventListener('touchmove', function(e){
            movedX = e.changedTouches[0].clientX; // 实时获取touchmove时的X/Y坐标
            movedY = e.changedTouches[0].clientY;
            // 计算手指位移距离
            distance = Math.sqrt( Math.pow(movedX - initX, 2) + Math.pow(movedY - initY, 2) );
        });
    });
    // 监听touchend事件
    element.addEventListener('touchend', function(e){
        delay = Date.now() - startTime; // 获取touchend和touchstart的时间间隔
        if(delay<300 && distance<30){
            handler(); // 执行传入的回调函数
        }
        distance = 0; // 重置距离
    });
}
```

## 进一步优化

这样实现了上述的效果，不过依然存在问题。

问题1：“点击穿透”现象；

问题2：点击时，被点击元素没有反馈。

先来说问题1：“点击穿透”现象：

在上述代码中，如果页面中两个元素相互重叠，上层元素点击消失或移出点击范围，且下层元素有监听点击事件时，上层的点击会触发下层的点击事件。

这是因为click事件有300ms的延迟，在touchend的时候隐藏了上层元素，而延时300ms的click事件点击到了下层的元素，即为“点击穿透”。

解决方案：

为touchend事件阻止默认动作：e.preventDefault();点击时，被点击元素经历如下事件流：touchstart->touchend->click。touchend时阻止默认行为，可以阻止后面事件的触发。

再来说问题2：

"所有能够响应触屏操作的元素在触屏后都应该有一个视觉上的反馈。这也是为什么一个"web"应用总是显得不够"原生"的主要原因之一。" —— React Native官方文档，TouchableWithoutFeedback

解决：为元素在被点击时添加一个class，这个class应该由用户以参数形式传入，用户可以使用这个class添加反馈的样式。

## 优化后的代码：

``` javascript
function onTap(element, handler, touchClass){
    element = document.querySelectorAll(element)[0];
    var initX, initY, movedX, movedY, distance, startTime, delay;
    element.addEventListener('touchstart', function(e){
        startTime = Date.now();
        distance = 0;
        initX = e.changedTouches[0].clientX;
        initY = e.changedTouches[0].clientY;
        // 如果touchClass参数存在则为点击的元素添加class
        if(touchClass){
            element.classList.add(touchClass);
            // 长按元素超过300ms不触发点击事件，移除touchClass
            setTimeout(function(){
                element.classList.remove(touchClass);
            },300);
        }
        element.addEventListener('touchmove', function(e){
            movedX = e.changedTouches[0].clientX;
            movedY = e.changedTouches[0].clientY;
            distance = Math.sqrt( Math.pow(movedX - initX, 2) + Math.pow(movedY - initY, 2) );
            if(touchClass && distance > 30){
                element.classList.remove(touchClass);
            }
        });
    });
    element.addEventListener('touchend', function(e){
        e.preventDefault(); // 阻止默认动作
        delay = Date.now() - startTime;
        if(delay < 300 && distance < 30){
            handler();
        }
        // 点击事件发生后移除touchClass
        if(touchClass) element.classList.remove(touchClass);
        distance = 0;
    });
}
```

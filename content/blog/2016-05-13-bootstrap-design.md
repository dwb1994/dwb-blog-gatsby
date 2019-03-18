---
title: Bootstrap表单界面美化
date: 2016-05-13
tags: [Design, UI]
photos: [https://ws1.sinaimg.cn/large/006cGJIjly1g12qrfaekwj31hc140gwf.jpg]
type: blog

---
前些日子给别人做了一个单页面，页面内部只有一个表单。
Bootstrap框架本身有一套比较基础的样式，如果不加修饰的话看起来会比较朴素，如下图:

![](https://ws1.sinaimg.cn/large/006cGJIjly1g12o4w5ehfj30ic0ci0wz.jpg)

可以看到Bootstrap对HTML基础的标签进行了一定的美化，但是仍达不到我们的期望，如果想制作得更精致的话需要进一步的美化。

这里提一句，正常的软件开发流程应该先根据需求分析做出低保真原型及高保真原型，然后做UI设计图后制作页面。

但是我做页面的个人习惯是先打腹稿，然后直接编码（HTML&CSS），由于我有少许美术基础，所以一般省略之前的环节直接做页面以节省时间，并不可取。

做好后的页面是这样的：

![](https://ws1.sinaimg.cn/large/006cGJIjly1g12s29d2o3j30qd0p0to6.jpg)

这个表单基于Bootstrap样式，Bootstrap的组件样式比较圆润，普遍是圆角组件，色彩较浅，一般我在美化的时候会把圆角改为直角，其实直角和圆角各有千秋，但是在内行眼里一眼就会看出这是基于Bootstrap的页面，如果这时发现组件全部改为直角，则会给他们一种用心设计的感觉。

其次尽量不要用Bootstrap原有的几种颜色，应该有自己的定制化设计，如果自己实在对色彩无感，这里我推荐[FLat UI](http://www.bootcss.com/p/flat-ui/)的几套配色。

![](https://ws1.sinaimg.cn/large/006cGJIjly1g12s2jeyrsj30ls08ijs7.jpg)

同一种颜色要有深浅两种基本形式，用以体现不同的使用逻辑或者阴影设计。同一个页面建议不要超过三种色调，否则颜色太繁多给人一种眼花缭乱的感觉。由于页面有基色，一般为白色，因此页面元素有两种颜色足矣。

在本例中由于用户需求那边给我了一套成品页面，只需要我在此基础上添加一页表单，因此我用了他们的主色调橙红色。修改了部分组件的圆角值、字体颜色、外发光等样式，下面我详细解析一下：

### 1.结构层次与阴影

本页面只有三层，或者说两层半，底层是一个背景图像，铺满整个屏幕；上层是一个半透明的白色矩形；在矩形的表面上有一些控件和文字，这些控件和文字一开始是纯扁平化设计的样式，没有阴影，但是当输入框获得焦点的时候会有一个阴影（box-shadow），阴影产生后获取焦点的控件会给人一种 “我浮到半空中了”的感觉，增强交互体验。

![](https://ws1.sinaimg.cn/large/006cGJIjly1g12s2upnr5j30ah02qt8q.jpg)

``` css
.main .form-control {
    color: #FFFFFF;
    border: 0;
    border-radius: 0;
    background-color: rgba(256, 256, 256, 0.2);
    box-shadow: 0 0 4px rgba(240, 95, 64, 0);
    transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    /* Firefox 4 */
    -webkit-transition: all 0.3s ease-in-out;
    /* Safari and Chrome */
    -o-transition: all 0.3s ease-in-out;
}

.main .form-control:focus {
    box-shadow: 0 0 4px rgba(240, 95, 64, 0.8);
}
```

background-color属性可以定义rgba，前三个值是RGB，第四个值是透明度，可以制作半透明效果，兼容到IE8，IE67需要降级处理，但是由于使用Bootstrap3，本身IE67已经被忽视了所以放心使用。

注意这里我不仅仅是用了box-shadow，还是用了CSS3的transition渐变效果，这样做在获取焦点的时候，阴影是在0.3秒时间内渐渐显示出来的，交互体验要优于唐突地瞬间显示出阴影。

### 2.设置表单颜色值
![](https://ws1.sinaimg.cn/large/006cGJIjly1g12s56dvghj30ah02qt8q.jpg)
还是这张图，前面以内联元素的形式嵌入Bootstrap包含的Glyphicons 字体图标，这里注意项目目录要包含fonts文件夹，否则图标不会显示出来。设置图标颜色不在话下。

然后input标签内部一般会有一个提示性的文字，这个文字我们一般希望他不可编辑，编辑文本时候它消失，清空时又显示出来（如果在input标签内部设置value属性值也可以显示提示文字，但是需要手动删除才能继续编辑），因此这里用到HTML 5 <input>标签的 placeholder 属性，注意只有支持HTML5的时候才有用。相关样式设置如下：

``` css
.form-control::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #EEEEEE;
}

.form-control:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #EEEEEE;
}

.form-control::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #EEEEEE;
}

.form-control:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #EEEEEE;
}
```

嗯，由于HTML5的兼容性，要做特殊强调以调用不同浏览器的渲染引擎。这里面即可设置提示文本的一些样式，chrome里提示文本默认为灰色，深色背景下看不清，因此我将它改为白色。

其实也可以使用javascript来做这个提示文本，可以做出更炫的效果，但是那样会比较麻烦，网上有很多案例，搜索“表单美化”即可查阅。

### 3.textarea优化

``` css
.msg-more textarea {
    resize: none;
}
```

懒，只写了一句，不允许右下角的小三角拉伸宽高，然后限制字数那块交给后端去做了，实际上前端可以使用javascript限制内容高度或者字节数并加以提示。

### 4.模态框优化

Bootstrap3有一个javascript插件叫模态框。

不要忽略模态框样式的优化，要尽可能保持页面风格统一。

![](https://ws1.sinaimg.cn/large/006cGJIjly1g12s3rn680j30hb05jaa2.jpg)

我这里就是基本的细节：

a.注意圆角直角问题

b.注意标题字号和内容字号一定要加以区别

c.设置隔断以增强这个简单提示的内容逻辑性

d.在前端使用javascript给用户一个5秒钟的机会回到表单页面而不是网站首页

javascript代码如下：

``` javascript
$('.btn-default').click(function() {
    $('.timer').html('5');
    var i = 5;
    var t = setInterval(function() {
        i--;
        $('.timer').html(i);
        if (i == 0) {
            window.open('index.html#about', '_self')
        }
    }, 1000)
    $('.clear').click(function() {
        clearInterval(t)
    })
})
```
逻辑很简单，初始化倒计时文本为“5”，然后设一个计时器t，每1000毫秒执行函数，减少i的值。

i值为零的时候跳转到首页。

如果在这5秒钟时间里点击关闭或者取消按钮，则清除计时器。

### 5.其他优化

除了本例中使用的表单组件，还有一些组件没有用到，比如单选/复选按钮、下拉复选框、滚动条、上传文件等等组件，如果以后我用到相应的美化将会更新在这篇日志里。

HTML5对input标签的type属性有了一些优化，新增了一些type属性，本例中我也使用了一部分：

邮箱的type值为email，电话的type值为tel，这些标签可能在web页面中显示的不明显，但是在移动设备上有的系统会有相应的优化，比如type属性值为emal的时候键盘自动转为英文键盘，在type属性值为tel的时候键盘自动转为数字键。

最后附上本例的页面链接吧：

[西大助手帮助信息页]()

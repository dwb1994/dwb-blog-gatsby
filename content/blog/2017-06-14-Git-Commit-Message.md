---
title: Git Commit Message规范
date: 2017-06-14
tags: [Git, 规范, 团队协作]
photos: [https://ws1.sinaimg.cn/large/006cGJIjly1g12nqtvkpvj31hc10e12v.jpg]
type: blog

---
## 零、前言
最近帮公司团队整理了一套 git commit message 的规范，遵循这种规范可以使团队在git上清晰地看到每次提交是什么类型的内容，便于追踪提交记录。

以下是规范的内容和在项目中配置commit message格式验证的脚本：

## 一、Message格式

``` html
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```
## 二、描述

1. type

| Tables        | Are           |
| :------------- |:-------------|
| feat      | 新功能 (feature) |
| fix      | 修复问题      |
| docs | 修改文档/注释等 (documentation)      |
| refactor      | 对原提交的修改或重构（理论上不影响现有功能）      |
| chore      | 修改构建工具/依赖等      |
| refactor      | 对原提交的修改或重构（理论上不影响现有功能）      |
| opti      | 优化(样式/交互/逻辑)等      |

注意事项
* type名称全部小写
* type后面紧跟英文冒号
* 冒号后需要保留一个空格

2. <scope>(可选)
修改文件的范围（包括但不限于 doc, middleware, core, config, plugin）
3. subject
少于100字，简短清晰地阐述提交内容
行末空一行
4. body(可选)
补充subject，如必要性、解决的问题、可能影响的地方，可以换行
如果有链接一定附上链接
5. footer(可选)
bug的id、issue的id等

## 三、示例

1. 简单示例
`feat: 完成登录页面布局`
2. 完整示例(执行 git commit 即可编辑多行的commit message)
```
docs: 使用ydoc3.1更新文档
添加新版本说明，包括新功能的使用方式
修复首页标题的错别字和链接地址错误 http://ued.qunar.com/ydoc/
Close #321
```

## 四、在项目中配置commit message格式验证
1. 使用npm安装验证工具
`npm install validate-commit-msg ghooks --save-dev`
2. 在package.json文件中添加配置

``` json
"config": {
  "ghooks": {
    "commit-msg": "validate-commit-msg"
  },
  "validate-commit-msg": {
    "types": [
      "feat",
      "fix",
      "docs",
      "test",
      "chore",
      "refactor",
      "opti"
    ],
    "warnOnFail": false,
    "maxSubjectLength": 100,
    "subjectPattern": ".+",
    "subjectPatternErrorMsg": "请输入message信息!",
    "helpMessage": "Commit message 格式错误, \n请查看规范: http://wiki.corp.qunar.com/pages/viewpage.action?pageId=159698767"
  }
}
```

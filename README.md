# 简介
# 使用手册
# 二次开发手册
## 模块化
### 页面
### 模块
#### 页面内模块
#### 整个项目全局模块
### 现有的全局模块
#### 1.信息框
##### 引入
```html
<module entry="msg" scope="global"/>
```
##### 方法和参数
```javascript
show({
    type: 'info',       //【信息窗类型】【可选】【默认值：info】【支持：info、warn、error】
    text: '世界，你好！', //【显示的提示信息】【可选】【默认值：提示信息】【支持：任意文本】
    confirm: hide => {  //【自定义确认按钮】【可选】【回调参数：关闭当前信息窗口的函数】
        hide();
    },
    cancel: hide => {   //【自定义取消按钮】【可选】【回调参数：关闭当前信息窗口的函数】
        hide();
    }
})
```
##### 案例
```html
<!--引入msg信息窗模块-->
<module entry="msg" scope="global"/>
```
```javascript
// 调用信息窗模块方法
MODULE('msg').show({
    type: 'info',
    text: '你好，世界',
    confirm: hide => {
        hide();
    },
    cancel: hide => {
        hide();
    }
});
```
#### 效果
## 定义模块
## 调用模块
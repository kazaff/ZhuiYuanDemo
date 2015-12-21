尝试使用React-Native android来开发追源网站的客户端，参考了[知乎日报](http://www.android-gems.com/lib/race604/ZhiHuDaily-React-Native)项目代码。

依赖的第三方类库中，目前可能存在几个问题：

1. react-native-fileupload的上传字段属性无法自定义问题，可以看这个问题贴：[https://github.com/PhilippKrone/react-native-fileupload/issues/5](https://github.com/PhilippKrone/react-native-fileupload/issues/5)，而且该类库npm版本可能不是最新的，所以你最好自己从github上下载最新版源码
2. react-native-scrollable-tab-view的npm版本也可能不是最新的，需要自己从github上下载最新版源码

###解释

本项目为测试学习目的，并没有优雅的代码组织，见谅～

更多总结，可以参考我的[博客](http://blog.kazaff.me)。


###TODO

1. 通知
2. loading
3. 分享
4. 网络状态检查
5. 业务逻辑的异常处理
6. 代码结构优化
7. IOS版
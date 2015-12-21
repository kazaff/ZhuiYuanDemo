'use strict';

var React = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  Text,
  View,
  Navigator,
  StyleSheet,
  ToolbarAndroid,
  ToastAndroid,
} = React;

var TimerMixin = require('react-timer-mixin');

var SplashScreen = require('./SplashScreen');
var MainScreen = require('./MainScreen');
var ArticleScreen = require('./ArticleScreen');
var CommentsScreen = require('./CommentsScreen');
var FeedBacksScreen = require("./FeedBacksScreen");
var AddCommentScreen = require("./AddCommentScreen");

var _navigator = null;
BackAndroid.addEventListener('hardwareBackPress', function() {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) { //若当前导航系统中的场景界面深度大于1，则返回到上一个界面
    _navigator.pop();
    return true;  //返回true表示处理过该button的点击事件，避免android回退按钮的默认逻辑（退出app）
  }
  return false; //若已经是根界面，则返回false，表示退出app
});

var timer = null;
var ZhuiYuan = React.createClass({
  mixins: [TimerMixin],
  getInitialState() {
    return {
      splashed: true,
    };
  },
  componentDidMount() {
    timer = this.setTimeout(  //设置为2秒自动关闭app的初始化界面
      () => {
        this.setState({splashed: true});
      },
      5000
    );
  },
  RouteMapper(route, navigationOperations) {  //这里承担了Navigator的路由责任
    _navigator = navigationOperations;
    if (route.name === 'home') {
      return (
        <View style={styles.container}>
          <MainScreen navigator={navigationOperations}/>
        </View>
      );
    } else if(route.name === "article") {
      return (
        <View style={styles.container}>
          <ArticleScreen data={route.article} navigator={navigationOperations} />
        </View>
      );
    } else if(route.name === "comments"){
      return (
        <View style={styles.container}>
          <CommentsScreen data={route.article} navigator={navigationOperations} />
        </View>
      );
    } else if(route.name === "addComment"){
      return (
        <View style={styles.container}>
          <AddCommentScreen data={route.article} navigator={navigationOperations} />
        </View>
      );
    } else if(route.name === "feedbacks"){
      return (
        <View style={styles.container}>
          <FeedBacksScreen data={route.comment} navigator={navigationOperations} />
        </View>
      );
    }
  },
  render() {
    if (this.state.splashed) {
      var initialRoute = {name: 'home'};
      return (
        <Navigator
          style={styles.container}
          initialRoute={initialRoute}
          configureScene={() => Navigator.SceneConfigs.FadeAndroid}
          renderScene={this.RouteMapper}
        />
      );

    } else {
      return (
        <SplashScreen skip={this._gotoHome} timer={5} />
      );
    }
  },
  _gotoHome(){
    this.setState({splashed: true});
    this.clearTimeout(timer);
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

AppRegistry.registerComponent('ZhuiYuan', () => ZhuiYuan);

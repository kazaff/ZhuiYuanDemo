'use strict';

var React = require('react-native');
var {
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight
} = React;

var Animated = require('Animated'); //动画api
var TimerMixin = require('react-timer-mixin');

var WINDOW_WIDTH = Dimensions.get('window').width;  //获取设备屏幕宽度，但这里并没有遵循官方推荐的用法（设备宽度是会动态变化的，例如屏幕旋转）

var SplashScreen = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function() {
    return {
      timer: 0,
      bounceValue: new Animated.Value(1),
    };
  },
  componentDidMount: function() {
    this.state.bounceValue.setValue(1);
    Animated.timing(
      this.state.bounceValue,
      {
        toValue: 1.5,
        duration: 5000,
      }
    ).start();

    this.setState({timer: this.props.timer})
    this.setInterval(
      () => {
        this.setState({timer: this.state.timer-1});
      },
      1000
    );
  },
  render: function() {
    var img, text;
    img = require('image!splash');
    text = '追源';

    //todo 下面图片的高度为何设置为1？
    return(
      <View style={styles.container}>
        <Animated.Image
          source={img}
          style={{
            flex: 1,
            width: WINDOW_WIDTH,
            height: 1,
            transform: [
              {scale: this.state.bounceValue},
            ]
          }} />

        <TouchableHighlight style={styles.skip_btn} onPress={this._onSkipButton}>
          <Text style={styles.text}>跳过 (<Text style={styles.timer}>{this.state.timer}</Text>s)</Text>
        </TouchableHighlight>
      </View>
    );
  },
  _onSkipButton(){
    this.props.skip();
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  skip_btn: {
    flex: 1,
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
  },
  timer: {
    color: 'red'
  }
});

module.exports = SplashScreen;

'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} = React;

var ScrollableTabView = require('react-native-scrollable-tab-view');
var deviceWidth = Dimensions.get('window').width; //todo 没有绑定屏幕旋转事件

var IndexList = require('./IndexList');
var MeScreen = require("./MeScreen");

var MainScreen = React.createClass({
  render(){

    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
      </View>
    );

    return (
      <View style={styles.container}>
        <ScrollableTabView locked={true} >
          <IndexList tabLabel="首页" style={styles.tabView} navigator={this.props.navigator} />
          <ScrollView tabLabel="原创" style={styles.tabView}>
            <View style={styles.card}>
              <Text>Flow</Text>
            </View>
          </ScrollView>
          <ScrollView tabLabel="认领" style={styles.tabView}>
            <View style={styles.card}>
              <Text>Jest</Text>
            </View>
          </ScrollView>
          <MeScreen tabLabel="我" style={styles.tabView} navigator={this.props.navigator}  />
        </ScrollableTabView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    width: deviceWidth,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
});

module.exports = MainScreen;

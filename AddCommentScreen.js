'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
} = React;

var { Icon, } = require('react-native-icons');

var WINDOW_HEIGHT = Dimensions.get('window').height;
var LIST_HEIGHT = WINDOW_HEIGHT - 80;

var API_ADDCOMMENT_URL = 'http://123.57.6.75:8080/source/comment/addition';

var DataRepository = require('./DataRepository');
var repository = new DataRepository();

var AddCommentScreen = React.createClass({
  getInitialState() {
    return {
      isLoading: false,
      comment: "",
    };
  },
  _onPressBackButton() {
    if (this.props.navigator) {
      this.props.navigator.pop();
    }
  },
  submit(){
    if(this.state.comment == ""){
      ToastAndroid.show("请输入留言", ToastAndroid.SHORT);
    }else{
      let that = this;
      //新增留言
      repository.getToken(function(error, result){
        if(error || result === null){
          ToastAndroid.show("请登录", ToastAndroid.SHORT);
        }else{
          fetch(API_ADDCOMMENT_URL, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "AUTH": result.session,
            },
            body: JSON.stringify({
              pid: that.props.data.id,
              type: 0,
              content: that.state.comment,
            })
          })
          .then((response) => response.json())
          .then((responseData) => {
            //console.log(responseData);
            if(responseData.status){
              ToastAndroid.show("保存成功", ToastAndroid.SHORT);
              if (that.props.navigator) { //todo 这里只能单纯的弹回到前一个页面，但是刚添加的留言并不会主动刷新，这里可以尝试使用事件通知的方式触发前一个留言列表页面的刷新
                that.props.navigator.pop();
              }
            }else{
              ToastAndroid.show(responseData.msg, ToastAndroid.SHORT);
            }
          })
          .catch((error) => {
            console.warn(error);
          })
          .done();;
        }
      });
    }
  },
  render(){
    return (
      <View style={styles.container}>
        <ToolBar title={this.props.data.title} back={this._onPressBackButton} createComment={this._onCreateComment} />
        <ScrollView keyboardDismissMode="on-drag">
          <Text style={{marginTop: 15, marginLeft: 15}}>撰写留言</Text>
          <View style={{borderWidth: 0.5, borderColor: "#ccc", margin: 10, padding: 5}}>
            <TextInput autoCapitalize="none" placeholder="留言内容" placeholderTextColor="#aaa" multiline={true}
              textAlignVertical="top" underlineColorAndroid="white" numberOfLines={1}
              style={{height: LIST_HEIGHT-160}}
              onChangeText={(text) => this.setState({comment: text})}
              value={this.state.comment} />
          </View>

          <TouchableOpacity onPress={this.submit}>
            <View style={styles.submitBtn}>
              <Text style={styles.submitFont}>提 交</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
});

var ToolBar = React.createClass({
  render(){
    return (
      <View style={styles.toolBar}>
        <TouchableOpacity onPress={this.props.back}>
            <View style={styles.actionItem}>
              <Icon
              name='ion|android-arrow-back'
              size={20}
              style={styles.actionIcon}
              />
            </View>
          </TouchableOpacity>
          <Text style={{color: "white"}}>{this.props.title}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  toolBar: {
    height: 56,
    backgroundColor: '#00a2ed',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionItem: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },
  actionIcon: {
    width: 32,
    height: 32,
    color: "white"
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  submitBtn: {
    backgroundColor: "#00a2ed",
    height: 40,
    width: 250,
    marginTop: 25,
    borderRadius: 20,
    alignSelf: "center",
  },
  submitFont: {
    alignSelf: "center",
    color: "white",
    marginVertical: 8,
  },
});

module.exports = AddCommentScreen;

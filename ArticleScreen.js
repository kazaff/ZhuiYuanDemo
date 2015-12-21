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
  TouchableNativeFeedback,
  TouchableHighlight,
  ToastAndroid,
} = React;

var WebViewAndroid = require('react-native-webview-android');
var { Icon, } = require('react-native-icons');

var API_ARTICLE_URL = "http://123.57.6.75:8080/source/production/detail/";

var ArticleScreen = React.createClass({
  getInitialState() {
    return {
      authorBar: true,
      isLoading: false,
      detail: {},
    };
  },
  componentDidMount() {
    this.fetchStories(this.props.data.id);
  },
  fetchStories(id) {
    this.setState({
      isLoading: true,
    });

    fetch(API_ARTICLE_URL+ id)
    .then((response) => response.json())
    .then((responseData) => {
      if(responseData.status){
        this.setState({
          isLoading: false,
          detail: responseData.data
        });
      }else{
        console.error(responseData.msg);
      }

    })
    .catch((error) => {
      console.error(error);
    })
    .done();
  },
  onNavigationStateChange(event) {
    console.log(event);
    //todo 尴尬了，由于所使用的webview组件当跳转回第一页时，默认回去读url属性，而我们需要让其重新渲染html属性中的内容
    //todo 但目前这么做，canGoBack属性将失效
    if((event.url == "about:blank") || (event.canGoForward==true && event.loading== false && event.url=="file:///")){
      this.state.detail.content = this.state.detail.content + " ";  //为了让WebViewAndroid组件重新初始化渲染
      this.setState({detail: this.state.detail});
    }
  },
  _goBack() {
    this.refs.webView.goBack();
  },
  _showComments(){
    this.props.navigator.push({
        title: this.props.data.title,
        name: 'comments',
        article: this.props.data,
      });
  },
  _openAttachment(){
    console.log("todo");
  },
  _share(){
    console.log("todo");
  },
  render(){

    let content = (
      <Text>
        正在加载...
      </Text>
    );
    if (!this.state.isLoading) {
      //补齐html结构
      var html = '<!DOCTYPE html><html><body>' + this.state.detail.content
        + '</body></html>';
      content = (
        <WebViewAndroid
            ref="webView"
            javaScriptEnabled={true}
            geolocationEnabled={false}
            builtInZoomControls={false}
            html={html}
            onNavigationStateChange={this.onNavigationStateChange}
            style={styles.containerWebView} />
      );
    }

    return (
      <View style={styles.viewContainer}>
        <ToolBar data={this.props.data} navigator={this.props.navigator} />
        {this.state.authorBar?
          <View style={styles.authorBar}>
            {this.props.data.creator.face?
              <Image
              source={{uri: this.props.data.creator.face}}
              style={styles.cellImage}/>
              :
              <Image source={require('image!account_avatar')} style={styles.cellImage}/>
            }
            <Text style={styles.info}>{this.props.data.creator.name}</Text>
            <View style={styles.closeBtn}>
              <TouchableOpacity onPress={()=>this.setState({authorBar: false})}>
                <Icon
                name='ion|ios-close-outline'
                size={20}
                style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        :null}
        {content}
        <StatusBar
          back={this._goBack}
          showComments={this._showComments}
          showAttachment={this._openAttachment}
          share={this._share} />
      </View>
    );
  },
});

var ToolBar = React.createClass({
  _onPressBackButton: function() {
    if (this.props.navigator) {
      this.props.navigator.pop();
    }
  },
  render(){
    return (
      <View style={styles.toolBarContainer}>
        <TouchableOpacity onPress={this._onPressBackButton}>
          <View style={styles.actionItem}>
            <Icon
            name='ion|android-arrow-back'
            size={20}
            style={styles.backIcon}
            />
          </View>
        </TouchableOpacity>
        <Text style={{color:"white"}}>{this.props.data.title}</Text>
      </View>
    );
  }
});

var StatusBar = React.createClass({
  render(){
    return (
      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={this.props.back}>
            <View style={styles.actionItem}>
              <Icon
              name='ion|chevron-left'
              size={20}
              style={styles.actionIcon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.showComments}>
            <View style={styles.actionItem}>
              <Icon
              name='ion|chatbox-working'
              size={20}
              style={styles.actionIcon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.showAttachment}>
            <View style={styles.actionItem}>
              <Icon
              name='ion|ios-filing-outline'
              size={20}
              style={styles.actionIcon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.share}>
            <View style={styles.actionItem}>
              <Icon
              name='ion|ios-upload-outline'
              size={20}
              style={styles.actionIcon}
              />
            </View>
          </TouchableOpacity>
      </View>
    );
  }
});


var styles = StyleSheet.create({
  viewContainer: {
    flex: 1
  },
  toolBarContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#00a2ed"
  },
  authorBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: "center",
    borderColor: '#dddddd',
    borderStyle: null,
    borderWidth: 0.5,
    paddingLeft: 10,
    height: 52
  },
  closeBtn: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  closeIcon: {
    width: 32,
    height: 32,
    color: "#999",
  },
  cellImage: {
    height: 50,
    marginRight: 15,
    width: 50,
    borderRadius: 100,
  },
  info: {
    justifyContent: 'flex-start',
  },
  containerWebView: {
    flex: 1,
  },
  statusContainer: {
    height: 56,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    backgroundColor: "#eee"
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
    color: "#999",
  },
  backIcon: {
    width: 32,
    height: 32,
    color: "white",
  }
});

module.exports = ArticleScreen;

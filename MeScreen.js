'use strict';

var React = require('react-native');
var {
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} = React;

var { Icon, } = require('react-native-icons');

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var FileUpload = require('NativeModules').FileUpload;

var API_LOGIN_URL = "http://123.57.6.75:8080/source/user/login";

var deviceHeight = Dimensions.get('window').height - 80;
var deviceWidth = Dimensions.get('window').width;

var DataRepository = require('./DataRepository');
var repository = new DataRepository();

var MeScreen = React.createClass({
  getInitialState() {
    return {
      isLoading: false,
      isLogin: false,
      account: "",
      password: "",
      user: {},
    };
  },
  componentDidMount() {
    //判断用户登录状态
    //repository.clearToken(function(){});
    repository.getToken(function(error, result){
      if(result){
        this.setState({isLogin: true, user: result});
      }
    }.bind(this));
  },
  login(){
    if(this.state.account == ""){
      ToastAndroid.show("请输入用户名", ToastAndroid.SHORT);
    }else if(this.state.password == ""){
      ToastAndroid.show("请输入密码", ToastAndroid.SHORT);
    }else{
      let that = this;
      //登录接口
      fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: this.state.account,
          password: this.state.password,
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        //console.log(responseData);
        if(responseData.status){
          repository.setToken(responseData.data, function(error){
            if(error){
              console.error(error);
            }else{
              that.setState({isLogin: true, user: responseData.data});
            }
          });
        }else{
          ToastAndroid.show(responseData.msg, ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        console.warn(error);
      })
      .done();;
    }
  },
  logout(){
    repository.clearToken(function(error){
      if(error){
        console.warn(error);
      }else{
        this.setState({isLogin: false, user: {}});
      }
    }.bind(this));
  },
  changeFace(){
    let that = this;
    var options = {
      title: '选择头像',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '从相册选取',
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.2, //很重要，不设置会导致app很卡
    };

    UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
      if (!didCancel) {
        // You can display the image using either:
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        //const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        console.log(response);

        FileUpload.upload({
            uploadUrl: 'http://123.57.6.75:8080/source/user/complete',
            method: 'POST', // default 'POST',support 'POST' and 'PUT'
            headers: {
              'Accept': 'application/json',
              "AUTH": that.state.user.session,
            },
            fields: { //todo 这里其实应该是当前用户真实的相关数据，由于服务接口修改头像捆绑在用户信息提交上了～
                'realName': '',
                "nickName": "",
                "sex": "0",
                "birth": "",
                "phone": "",
                "icdNum": "",
            },
            files: [
              {
                name: 'faceFile', //todo 这里要叮嘱一下，由于所使用的FileUpload组件版本bug，这个参数并没有被使用，可以看https://github.com/PhilippKrone/react-native-fileupload/issues/5
                filename: response.uri.substring(response.uri.lastIndexOf("/")+1), // require, file name
                filepath: response.uri // require, file absoluete path
              },
            ]
        }, function(err, result) {
          console.log('upload:', err, result);
        });
      }
    });
  },
  render(){
    if(this.state.isLogin){
      return (
        <View style={styles.userContainer}>
          <TouchableOpacity onPress={this.changeFace}>
            {
              this.state.user.face ?
              <Image
              source={{uri: this.state.user.face}}
              style={styles.cellImage}/>
              :
              <Image source={require('image!account_avatar')} style={styles.cellImage}/>
            }
          </TouchableOpacity>
          <Text style={{marginTop: 15}}>{this.state.user.mail}</Text>
          <View style={[styles.itemRow, {marginTop: 25}]}>
            <Text>个人资料</Text>
            <Icon
              name='ion|ios-arrow-right'
              size={20}
              style={styles.rigthBtn} />
          </View>
          <View style={styles.itemRow}>
            <Text>我发布的</Text>
            <Icon
              name='ion|ios-arrow-right'
              size={20}
              style={styles.rigthBtn} />
          </View>
          <View style={[styles.itemRow, {borderBottomWidth: 0.5}]}>
            <Text>我认领的</Text>
            <Icon
              name='ion|ios-arrow-right'
              size={20}
              style={styles.rigthBtn} />
          </View>
          <View>
            <TouchableOpacity onPress={this.logout}>
              <View style={[styles.loginBtn, {backgroundColor: "#F3231D"}]}>
                <Text style={styles.loginFont}>退出账号</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }else{  //考虑到键盘影响布局，所以这里一定要包裹一层ScrollView
      return (
        <ScrollView>
          <View style={styles.loginContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require('image!logo')}
                style={styles.logo} />
              <Text style={styles.logoFont}>追源</Text>
            </View>
            <View>
              <TextInput autoCapitalize="none" placeholder="注册邮箱" keyboardType="email-address" textAlign="center"
                style={{height: 40, width: 250, borderColor: 'gray', borderWidth: 1, marginTop: 25}}
                onChangeText={(text) => this.setState({account: text})}
                value={this.state.account} />
              <TextInput autoCapitalize="none" placeholder="密码" textAlign="center" secureTextEntry={true}
                style={{height: 40, width: 250, borderColor: 'gray', borderWidth: 1, marginTop: 25}}
                onChangeText={(text) => this.setState({password: text})}
                value={this.state.password} />

              <TouchableOpacity onPress={this.login}>
                <View style={styles.loginBtn}>
                  <Text style={styles.loginFont}>登 录</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      );
    }
  }
});

var styles = StyleSheet.create({
  userContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: deviceHeight,
    backgroundColor: "white",
    paddingTop: 25,
  },
  loginContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: deviceHeight,
    backgroundColor: "white",
  },
  logoContainer: {
    width: 150,
    height: 150,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  logoFont: {
    position: "absolute",
    top: 60,
    left: 100,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    width: 30,
  },
  loginBtn: {
    backgroundColor: "#00a2ed",
    height: 40,
    width: 250,
    marginTop: 25,
    borderRadius: 20,
  },
  loginFont: {
    alignSelf: "center",
    color: "white",
    marginVertical: 8,
  },
  cellImage: {
    height: 80,
    width: 80,
    borderWidth: 1,
    borderColor: "#00a2ed",
    borderRadius: 100,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: deviceWidth,
    padding: 25,
    height: 50,
    borderTopWidth: 0.5,
    borderColor: "#dddddd",
  },
  rigthBtn: {
    width: 32,
    height: 32,
    color: "#ccc"
  }
});

module.exports = MeScreen;

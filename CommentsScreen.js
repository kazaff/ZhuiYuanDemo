'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ListView,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
} = React;

var { Icon, } = require('react-native-icons');

var WINDOW_HEIGHT = Dimensions.get('window').height;
var LIST_HEIGHT = WINDOW_HEIGHT - 80; //计算出滚动区域的高度

var WINDOW_WIDTH = Dimensions.get('window').width;
var LIST_INFO_WIDTH = WINDOW_WIDTH - 121;

var API_COMMENTS_URL = 'http://123.57.6.75:8080/source/comment/list/';
var lastPage = 1;
var dataList = [];

var CommentsScreen = React.createClass({
  getInitialState() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.id !== row2.id,
    });

    return {
      isLoading: false,
      dataSource: dataSource,
    };
  },
  componentDidMount() {
    lastPage = 1;
    dataList = [];
    this.fetchStories(lastPage);
  },
  fetchStories(page) {
    lastPage = parseInt(page) < 0 ? lastPage : parseInt(page);
    this.setState({
      isLoading: true,
    });

    fetch(API_COMMENTS_URL + this.props.data.id + "/0/" + lastPage + "/7?type=0&cate=0")
    .then((response) => response.json())
    .then((responseData) => {
      if(responseData.status){
        dataList = dataList.concat(responseData.data);
        this.setState({
          isLoading: false,
          dataSource: this.state.dataSource.cloneWithRows(dataList)
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
  _pressRow(data){
    this.props.navigator.push({
        title: data.title,
        name: 'feedbacks',
        comment: data,
      });
  },
  renderRow(rowData: string, sectionID: number, rowID: number){
    return (
      <TouchableOpacity onPress={() => this._pressRow(rowData)}>
        <View style={styles.listRow}>
          {rowData.fromUser.face?
            <Image
            source={{uri: rowData.fromUser.face}}
            style={styles.cellImage}/>
            :
            <Image source={require('image!account_avatar')} style={styles.cellImage}/>
          }
          <View style={styles.info}>
            <Text style={styles.text}>{rowData.content}</Text>
          </View>
          <View>
            <Icon
            name='ion|ios-arrow-right'
            size={20}
            style={styles.rigthBtn}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  _onPressBackButton() {
    if (this.props.navigator) {
      this.props.navigator.pop();
    }
  },
  _onCreateComment(){
    this.props.navigator.push({
        title: "新增回复",
        name: 'addComment',
        article: this.props.data,
      });
  },
  render(){ //坑，当ListView和包含在某个元素内部时，必须设置其高度，否则无法响应滚动
    return (
      <View>
        <ToolBar title={this.props.data.title} back={this._onPressBackButton} createComment={this._onCreateComment} />
        <ListView style={{height: LIST_HEIGHT}}
          onEndReached={()=>{this.fetchStories(lastPage+1);ToastAndroid.show("加载中", ToastAndroid.SHORT);}}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
      </View>
    );
  },
});

var ToolBar = React.createClass({
  render(){
    return (
      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={this.props.back}>
            <View style={styles.actionItem}>
              <Icon
              name='ion|android-arrow-back'
              size={20}
              style={styles.actionIcon}
              />
            </View>
          </TouchableOpacity>
          <Text style={{width:100, height:24, flexWrap:"nowrap", overflow:"hidden", color:"white"}}>{this.props.title}</Text>
          <Text style={{height:24, color:"white"}}>...</Text>
          <View style={styles.edit}>
            <TouchableOpacity onPress={this.props.createComment}>
              <View style={styles.actionItem}>
                <Icon
                name='ion|compose'
                size={20}
                style={styles.actionIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  toolBar: {
    height: 56,
    backgroundColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    marginRight: 10,
    marginVertical: 5,
    borderColor: '#dddddd',
    borderStyle: null,
    borderWidth: 0.5,
    borderRadius: 2,
  },
  cellImage: {
    height: 50,
    marginRight: 15,
    width: 50,
    borderRadius: 100,
  },
  info: {
    width: LIST_INFO_WIDTH,
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 12,
  },
  rigthBtn: {
    width: 32,
    height: 32,
    color: "#ccc"
  },
  statusContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#00a2ed"
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
  edit: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});

module.exports = CommentsScreen;

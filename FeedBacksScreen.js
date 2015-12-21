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
var LIST_INFO_WIDTH = WINDOW_WIDTH - 101;

var API_FEEDBACKS_URL = 'http://123.57.6.75:8080/source/comment/replylist/';

var FeedbacksScreen = React.createClass({
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
    this.fetchStories();
  },
  fetchStories() {
    this.setState({
      isLoading: true,
    });

    fetch(API_FEEDBACKS_URL + this.props.data.id)
    .then((response) => response.json())
    .then((responseData) => {
      if(responseData.status){
        this.setState({
          isLoading: false,
          dataSource: this.state.dataSource.cloneWithRows(responseData.data)
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
  renderRow(rowData: string, sectionID: number, rowID: number){
    return (
      <View style={styles.listRow}>
        {rowData.fromUser.face?
          <Image
          source={{uri: rowData.fromUser.face}}
          style={styles.cellImage}/>
          :
          <Image source={require('image!account_avatar')} style={styles.cellImage}/>
        }
        <View style={styles.info}>
          <Text style={styles.text}>{rowData.content}...</Text>
        </View>
      </View>
    );
  },
  _onPressBackButton() {
    if (this.props.navigator) {
      this.props.navigator.pop();
    }
  },
  _onCreateFeedBack(){
    console.log("todo");
  },
  render(){
    return (
      <View>
        <ToolBar back={this._onPressBackButton} createFeed={this._onCreateFeedBack} />
        <ListView style={{height: LIST_HEIGHT}}
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
          <View style={styles.edit}>
            <TouchableOpacity onPress={this.props.createFeed}>
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

module.exports = FeedbacksScreen;

'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  Text,
  View,
  ListView,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  ToolbarAndroid,
} = React;

var deviceWidth = Dimensions.get('window').width; //todo 没有绑定屏幕旋转事件


var API_HOME_URL = 'http://123.57.6.75:8080/source/production/list/';
var lastPage = 1;
var dataList = [];

var IndexList = React.createClass({
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
    this.fetchStories(lastPage);
  },
  fetchStories(page) {
    lastPage = parseInt(page) < 0 ? lastPage : parseInt(page);
    this.setState({
      isLoading: true,
    });

    fetch(API_HOME_URL+ lastPage + "/7?type=0&cate=0")
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
  renderRow(rowData: string, sectionID: number, rowID: number){
    return (
      <TouchableOpacity onPress={() => this._pressRow(rowData)}>
        <View style={styles.listRow}>
          {rowData.creator.face?
            <Image
            source={{uri: rowData.creator.face}}
            style={styles.cellImage}/>
            :
            <Image source={require('image!account_avatar')} style={styles.cellImage}/>
          }
          <View style={styles.info}>
            <Text style={styles.text}>{rowData.content}...</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  render(){
    return (
      <ListView
          onEndReached={()=>{this.fetchStories(lastPage+1);ToastAndroid.show("加载中", ToastAndroid.SHORT);}}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
    );
  },
  _pressRow(data){
    this.props.navigator.push({
        title: data.title,
        name: 'article',
        article: data,
      });
  },
});

var styles = StyleSheet.create({
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
    width: 200,
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 12,
  }
});

module.exports = IndexList;

import React, {Component} from 'react';
import {View, Text, FlatList, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Friends extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      listOfFriends: [],
      dataList:[],
      id: '',
      first_name: '',
      last_name: '',
      password: '',
      email: ''

    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
           method: 'get',
          'headers': {
            'X-Authorization':  token
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            listData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  addFriendFunction = async () => {

    let to_send = {
      id: parseInt(this.state.id),
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email
    };

    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/friends", {
        method: 'post',
          'headers': {
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(to_send)
        })
        .then((response) => {
          Alert.alert("Item added");
          console.log("getting data stage 1")
          //this.retrieveData();
          //this.getData();
          return response.json()

        })
        .catch((error) => {
          console.log(error);
        })
      }

  retrieveData = async () => {
    console.log("getting data...");
    return fetch("http://localhost:3333/api/1.0.0/friendrequests")
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            isLoading: false,
            dataList: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
    console.log("data got");
  }

  listOfFriends = async () => {

    const value = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/friends", {
            method: 'get',
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            listData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
        this.props.navigation.navigate('Login');
    }
  };

  
  
  render() {

    if (this.state.isLoading){
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading..</Text>
        </View>
      );
    }else{
      return (
        <View>
          <FlatList
                data={this.state.listData}
                renderItem={({item}) => (
                    <View>
                      <Text>Friend requests from: {item.first_name} {item.last_name} {item.email}</Text>
                      <Text>List of friends: {item.first_name} {item.last_name}</Text>
                      <Button
                        title="Add Friend"
                        onPress={() => this.addFriendFunction()}/>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
        </View>
      );
    }
  }
}

export default Friends;
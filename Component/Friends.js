import React, {Component} from 'react';
import {View, Text, FlatList, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Friends extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      friendRequestList: []

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
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else if(response.status === 500){
              console.log("Server Error")
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            friendRequestList: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  addFriendFunction = async (userId) => {

    const token = await AsyncStorage.getItem('@session_token');
    //const userId = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + userId , {
        method: 'post',
          'headers': {
            'X-Authorization':  token
          },
          
        })
        .then((response) => {
          if(response.status === 200){
            this.getData()
          }else if (response.status === 401){
            this.props.nagivation.navigate("login");
          }else if (response.status === 404){
            this.props.nagivation.navigate("Nothing has been found");
          }else{
            throw 'something went wrong';
          }
        })
        .catch((error) => {
          console.log(error);
        })
      }
  
  removeFriendFunction = async (userId) => {

        const token = await AsyncStorage.getItem('@session_token');
        //const userId = await AsyncStorage.getItem('@session_id');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + userId, {
            method: 'Delete',
              'headers': {
                'X-Authorization':  token
              },
              
            })
            .then((response) => {
              if(response.status === 200){
                this.getData()
              }else if (response.status === 401){
                this.props.nagivation.navigate("login");
              }else if (response.status === 404){
                this.props.nagivation.navigate("Nothing has been found");
              }else{
                throw 'something went wrong';
              }
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
                data={this.state.friendRequestList}
                renderItem={({item}) => (
                    <View>
                      <Text>Friend requests from: {item.first_name} {item.last_name} {item.email}</Text>
                      <Text>List of friends: {item.first_name} {item.last_name}</Text>
                      <Button
                        title="Add Friend request"
                        onPress={() => this.addFriendFunction(item.user_id)}/>

                      <Button
                        title="Delete Friend request"
                        onPress={() => this.removeFriendFunction(item.user_id)}/>
                    </View>
                )}
                //keyExtractor={(item,index) => item.user_id.toString()}
              />
        </View>
      );
    }
  }
}

export default Friends;
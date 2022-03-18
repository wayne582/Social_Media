import React, {Component} from 'react';
import {View, Text, FlatList, Button, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class FriendRequests extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      friendRequestList: [],
      friendList: [],
      listData: []

    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    
    this.getData();
    this.getfriendrequestlist();
    this.showfriends();
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
              console.log(response)
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
            listData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  acceptFriendRequest = async (friendrequestsId) => {

    console.log("Add user")

    const token = await AsyncStorage.getItem('@session_token');
    //const userId = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + friendrequestsId , {
        method: 'POST',
          'headers': {
            'X-Authorization':  token
          },
          
        })
        .then((response) => {
          if(response.status === 200){
            console.log("Friend has already been added")
          }else if (response.status === 401){
            this.props.nagivation.navigate("login");
          }else if (response.status === 404){
            this.props.nagivation.navigate("Nothing has been found");
          }else if (response.status === 500){
            this.props.nagivation.navigate("Server Error");
          }else{
            throw 'something went wrong';
          }
        })
        .then((responseJson) => {
          this.showfriends();
          this.getfriendrequestlist();
          this.setState({
            isLoading: false,
            listData: responseJson
          })
        })
        .catch((error) => {
          console.log(error);
        })
      }
  
      deleteFriendRequest = async (friendrequestsId) => {
    
        const token = await AsyncStorage.getItem('@session_token');

        return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + friendrequestsId , {
            method: 'DELETE',
              'headers': {
                'X-Authorization':  token
              },
              
            })
            .then((response) => {
              if(response.status === 200){
                console.log("Friend declined your request")
              }else if (response.status === 401){
                this.props.nagivation.navigate("Login");
              }else if (response.status === 404){
                console.log("Unauthorised");
              }else if (response.status === 500){
                console.log("Server Error");
              }else{
                throw 'something went wrong';
              }
            })
            .then((responseJson) => {
              this.getfriendrequestlist();
              this.setState({
                isLoading: false,
                listData: responseJson
              })
            })
            .catch((error) => {
              console.log(error);
            })
          }

    showfriends = async () => {
         
        const token = await AsyncStorage.getItem('@session_token');
        const userId = await AsyncStorage.getItem('@session_id');

        return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/friends", {
        
          'headers': {
            'X-Authorization':  token
           },
                      
           })
             .then((response) => {
              if(response.status === 200){
                return response.json();
              }else if (response.status === 401){
                this.props.nagivation.navigate("login");
              }else if (response.status === 403){
                throw new error ("Can only view the friends of yourself or your friends")
              }else if (response.status === 404){
                throw new error ("Not found")
              }else if (response.status === 500){
                throw new error ("Server Error")
              }else{
                throw 'something went wrong';
              }
              })
              .then((responseJson) => {
                this.setState({
                  isLoading: false,
                  friendList: responseJson
                })
              })
              .catch((error) => {
                console.log(error);
               })
            }

  getfriendrequestlist = async () => {

    const token = await AsyncStorage.getItem('@session_token');

    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
          method: 'get',
          'headers': {
            'X-Authorization':  token,
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
                    <Text>Requests from: {item.first_name} {item.last_name}</Text>

                    <Button
                      title='Accept Request'
                      onPress={() => this.acceptFriendRequest(item.user_id)}
                    />

                    <Button
                      title='Delete Request'
                      onPress={() => this.deleteFriendRequest(item.user_id)}
                    />

                  </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />

        </View>
      );
    }
  }
}

export default FriendRequests;
import React, {Component} from 'react';
import {View, Text, FlatList, Button, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Friends extends Component {
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

  SendFriendRequest = async (friendrequestsId) => {

    const token = await AsyncStorage.getItem('@session_token');
    //const userId = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + friendrequestsId +"/friends" , {
        method: 'POST',
          'headers': {
            'X-Authorization':  token
          },
          
        })
        .then((response) => {
          if(response.status === 201){
            console.log("Friend request has been sent")
          }else if (response.status === 401){
            console.log("Unauthorised")
          }else if (response.status === 403){
            console.log("User is already added as a friend")
          }else if (response.status === 404){
            console.log("Not Found")
          }else if (response.status === 500){
            console.log("Server Error")
          }else{
            throw 'something went wrong';
          }
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
          // method: 'get',
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
        <View style = {styles.container}>

          <Text style = {styles.title}>List of friends: </Text>
              <FlatList
                data={this.state.friendList}
                renderItem={({item}) => (                
                  <View>
                    <Text style = {styles.text}>{item.user_givenname} {item.user_familyname}</Text>

                    <Button
                      title='Send friend request'
                      onPress={() => this.SendFriendRequest(item.user_id)}
                    />
                  </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
         
        <View style = {styles.bottomContainer}>

          <TouchableOpacity
              onPress={() => {this.props.navigation.navigate("FriendRequest"); }}
              style={{
                borderBottomColor:this.state.popularSelected ? "#FFF":"#044244",
                borderBottomWidth:4,
                paddingVertical:6,
                marginLeft:30
              }}
              >
              <Text style={{
                fontFamily:"Bold",
                //color:this.state.popularSelected ? "#9ca1a2":"#044244"
              }}>SEE FRIEND REQUESTS</Text>
            </TouchableOpacity>

        </View>

        </View>
      );
    }
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    height:"100%",
    backgroundColor:"#e8f3ec",  
   },

   text: {
    fontFamily:"Bold",
    color: "Black",
    fontFamily: 'notoserif',
    fontWeight: 'normal',
    fontSize: 22,
   },
  
   bottomContainer: {
    backgroundColor:"#FFF",
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    height:70,
    paddingHorizontal:35
   },

  title: {
    fontFamily:"Bold",
    fontSize:22,
    color:"black",
    paddingVertical:25,
    fontFamily: 'Courier New',
    fontWeight: 'normal',
  },

  inputView: {
    backgroundColor: "#add8e6",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
    fontWeight: 'bold',
  },

  signUp_button: {
    height: 30,
    marginBottom: 30,
    fontWeight: 'bold',
  },

  image :{
    marginBottom: 40,
    width: 200,
    height: 200,
  },
    loginBtn: {
      width:"80%",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:40,
      backgroundColor:"#87cefa",
    },
});

export default Friends;
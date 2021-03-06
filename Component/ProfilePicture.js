import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Update from "../Component/Update";

class ProfilePicture extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      photo: null,
      listPost: [],
      postData: "",
      userInfo: [],
      first_name:"",
      last_name:"",
      userDetails: []
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getData();
    this.getPhoto();
    
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
           method: 'get',
          'headers': {
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
            if(response.status === 200){
                console.log(response);
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else if(response.status === 404){
              console.log("Error with server")
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          console.log(responseJson);
          this.setState({
            isLoading: false,
            userDetails: responseJson,
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
      console.log(this.state.listData)
      return (
             
        <Image
                  style={{ width: size, height: size }}
                  source={{
                    uri:
                      response,
                  }}

        />
    
      );
    }
  }
}

export default ProfilePicture;
import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, Image, ScrollView} from 'react-native';
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
      userDetails: [],
      email:""
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
            first_name: responseJson.first_name,
            last_name: responseJson.last_name,
            email: responseJson.email,
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  getPhoto = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId +"/photo?" + Date.now(), {
           method: 'get',
          'headers': {
            'X-Authorization':  token,
            //'Content-Type': 'application/json'
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
        .then((responsePhoto) => {
          let data = URL.createObjectURL(responsePhoto)
          this.setState({
            photo: data
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
          <ScrollView>
            <Image
              source={{
                uri: this.state.photo,
              }}
              style = {{
                width: 100,
                height: 100,

              }}
              />
            <Text>
              First name: {this.state.first_name} <br/>
              Last name: {this.state.last_name} <br/>
              Email address: {this.state.email} 
            </Text> 

            <Button
              title='Update Profile'
              onPress={() => this.props.navigation.navigate("UpdateUserProfile")}
            />
          </ScrollView>
        </View>
    
      );
    }
  }
}

export default ProfilePicture;
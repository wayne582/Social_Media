import React, { Component } from 'react';
import { StyleSheet, Image, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      photo: null,
      isLoading: true,
      first_name:"",
      last_name:"",
      email:"",
      friends: ""
    }
  }

  get_profile_image = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId +"/photo", {
           method: 'GET',
          'headers': {
            'X-Authorization':  token,
            //'Content-Type': 'application/json'
          }
        })
    .then((res) => {
      return res.blob();
    })
    .then((resBlob) => {
      let data = URL.createObjectURL(resBlob);
      this.setState({
        photo: data,
        isLoading: false
      });
    })
    .catch((err) => {
      console.log("error", err)
    });
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
            friends: responseJson.friend_count
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  componentDidMount(){
    this.get_profile_image();
    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render(){
    if(!this.state.isLoading){
      return (
        <View style={styles.container}>
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={{
              width: 200,
              height: 200,
              borderWidth: 5 
            }}
          />

        <Text>
              First name: {this.state.first_name} <br/>
              Last name: {this.state.last_name} <br/>
              Email address: {this.state.email} <br/>
              number of friends: {this.state.friends} 
            </Text> 

            <Button
              title='Update Profile'
              onPress={() => this.props.navigation.navigate("UpdateUserProfile")}
            />
        </View>
      );
    }else{
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }
    
  }
  
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    height:"100%",
    backgroundColor:"#e8f3ec",  
   },
});
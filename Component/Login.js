import React, { Component } from 'react';
import { Image, Text, useState, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity,} from 'react-native';
import { StatusBar } from "expo-status-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: ''
    
    }
  }

  login = async () => {

    //Validation here...

    return fetch("http://localhost:3333/api/1.0.0/login", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
    })
    .then((response) => {
        if(response.status === 200){
            return response.json()
            
        }else if(response.status === 400){
            throw 'Invalid email or password';
        }else{
            throw 'Something went wrong';
        }
    })
    .then(async (responseJson) => {
            console.log(responseJson);
            await AsyncStorage.setItem('@session_token', responseJson.token);
            await AsyncStorage.setItem('@session_id', responseJson.id);
            this.props.navigation.navigate("Home");
    })
    .catch((error) => {
        console.log(error);
    })
}

  handleEmailInput = (email) =>{
    //validation will be carried out here for the email
    this.setState({email: email})
  }

  handlePasswordInput = (pass) =>{
    //validation will be carried out here for the password
    this.setState({password: pass})
  }
  
  
  render() {
    return (
      <View style = {styles.container}>
       
       <Image
        style={styles.image}
        source={{
          uri: 'https://cdn.dribbble.com/users/4229785/screenshots/14072506/media/4fa4868265580c2792ef24887618511c.jpg?compress=1&resize=400x300&vertical=top',
        }}
      />

        <StatusBar style="auto" />
        <View style={styles.inputView}>
          <TextInput 
            style = {styles.TextInput}          
            placeholder = 'Email' 
            onChangeText={this.handleEmailInput}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput 
            style = {styles.TextInput}          
            placeholder = 'Password' 
            secureTextEntry={true}
            onChangeText={this.handlePasswordInput}
          />
        </View>
      
        <TouchableOpacity>
          <Text style={styles.forgot_button}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.signUp_button}>Sign Up</Text>
        </TouchableOpacity>

        <Button
          title="Sign Up"
          color="#87cefa"
          onPress={() => this.props.navigation.navigate('SignUp')}
        />
      
        <Button
          title="Login"
          color="#87cefa"
          //onPress={() => this.props.navigation.navigate('Home')}
          onPress = {() => this.login()}
        />
      </View>
    
    );
  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
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

export default Login

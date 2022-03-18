import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TextInput, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Update from "../Component/Update";

class UpdateScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.updateData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  updateData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId , {
           method: 'PATCH',
          'headers': {
            'X-Authorization':  token
          }
        })
        .then((response) => {
            if(response.status === 200){
                console.log(response);
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          console.log(responseJson);
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
      console.log(this.state.listData)
      return (
        <ScrollView>
        <TextInput
            placeholder="Update your first name..."
            onChangeText={(first_name) => this.setState({first_name})}
            value={this.state.first_name}
            style={{padding:5, borderWidth:1, margin:5}}
        />
        <TextInput
            placeholder="Update your last name..."
            onChangeText={(last_name) => this.setState({last_name})}
            value={this.state.last_name}
            style={{padding:5, borderWidth:1, margin:5}}
        />
        <TextInput
            placeholder="Update your email..."
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            style={{padding:5, borderWidth:1, margin:5}}
        />
        <TextInput
            placeholder="Update your password..."
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            secureTextEntry
            style={{padding:5, borderWidth:1, margin:5}}
        />
        <Button
            title="Update details"
            onPress={() => this.updateData()}
        />
        </ScrollView>
 
      );
    }
  }
}

export default UpdateScreen;
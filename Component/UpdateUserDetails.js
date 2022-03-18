import React, { Component } from 'react';
import { Text, ScrollView, Button, View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdateUserDetails extends Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
           
            first_name:"",
            last_name:"",
            email: "",
            //password: "",
            orig_first_name:"",
            orig_last_name:"",
            orig_email:"",
            dataToPass: {}
            //orig_password: "",
          }
        }    

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });   
        
        this.getData();
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null) {
          this.setState({token:value});
        }else{
            this.props.navigation.navigate("Login");
        }
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
                
                orig_first_name: responseJson.first_name,
                orig_last_name: responseJson.last_name,
                orig_email: responseJson.email,
              })
            })
            .catch((error) => {
                console.log(error);
            })
      }

    updateDetails = async() => {

        let to_send = {};

        if (this.state.first_name != this.state.dataToPass.orig_first_name){
          to_send['first_name'] = this.state.first_name;
        }
    
        if (this.state.last_name != this.state.dataToPass.orig_last_name){
          to_send['last_name'] = this.state.last_name;
        }
    
        if (this.state.email != this.state.dataToPass.orig_email){
          to_send['email'] = this.state.email;
        }
      
        console.log(JSON.stringify(to_send)); 
        
        const token = await AsyncStorage.getItem('@session_token');
        const userId = await AsyncStorage.getItem('@session_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
           method: 'PATCH',
          'headers': {
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(to_send)


        })
        .then((response) => {
            if(response.status === 200){
                console.log(response);
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else if(response.status === 403){
                console.log("Foridden")
            }else if(response.status === 404){
              console.log("Nothing was found")
            }else{
                throw 'Something went wrong';
            }
        })
       .catch((error) => {
            console.log(error);
        })
    } 
    
    render(){
        return (
          <View>
        <Text>Update details: </Text>

        <TextInput
            placeholder="First name"
            onChangeText={(first_name) => this.setState({first_name})}
            value={this.state.dataToPass.first_name}
        />
        <Text>Last Name:</Text>
        <TextInput
            placeholder="Last name"
            onChangeText={(last_name) => this.setState({last_name})}
            value={this.state.dataToPass.last_name}
        />
        <Text>Email:</Text>
        <TextInput
             placeholder="Email Address"
             onChangeText={(email) => this.setState({email})}
             value={this.state.dataToPass.email}
        />

        <Button
          title="Update Profile Photo"
          onPress={() => this.props.navigation.navigate('Camera')}
        />
      
      <Button
          title="Logout"
          onPress={() => this.props.navigation.navigate('Logout')}
        />
        <Button
            title="Update"
            onPress={() => this.updateDetails()}
           // onPress={() => this.props.navigation.navigate('cameraScreen')}

        />

        
    </View>
        )
    }
}

export default UpdateUserDetails;
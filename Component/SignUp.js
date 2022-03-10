import React, { Component } from 'react';
import { Button, ScrollView, TextInput, StyleSheet, View, Image } from 'react-native';
import ValidationComponent from 'react-native-form-validator';

class SignupScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
        }
    }

    signup = () => {
        //Validation here...

        const _validationButton = () => {
            validate({
              first_name: { required: true },
              last_name: { required: true },
              email: { email: true },
              //confirmPassword: { equalPassword: newPassword },
            });
          };

        return fetch("http://localhost:3333/api/1.0.0/user", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 201){
                return response.json()
            }else if(response.status === 400){
                throw 'Failed validation';
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
               console.log("User created with ID: ", responseJson);
               this.props.navigation.navigate("Home");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render(){
        return (
            <View style = {styles.container}>

                <Image
                    style={styles.image}
                    source={{
                    uri: 'https://cdn.dribbble.com/users/4229785/screenshots/14072506/media/4fa4868265580c2792ef24887618511c.jpg?compress=1&resize=400x300&vertical=top',
                }}/>

                <ScrollView>                  

                    <View style={styles.inputView}>
                        <TextInput style = {styles.TextInput} 
                        placeholder="First name "
                        onChangeText={(first_name) => this.setState({first_name})}
                        value={this.state.first_name}
                        />
                    </View>
                
                <View style={styles.inputView}>
                    <TextInput style = {styles.TextInput}
                        placeholder="Last name "
                        onChangeText={(last_name) => this.setState({last_name})}
                        value={this.state.last_name}
                    />
                </View>

                <View style={styles.inputView}>
                    <TextInput style = {styles.TextInput}
                        placeholder="Email "
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                    />
                </View>

                <View style={styles.inputView}>
                    <TextInput style = {styles.TextInput}
                        placeholder="Password "
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        secureTextEntry
                    />
                </View>

                <Button
                    title="Create an account"
                    onPress={() => this.signup()}
                />
            </ScrollView>
            </View>
        )
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
      width: "100%",
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

      image :{
        marginTop: 50,
        marginBottom: 50,
        width: 200,
        height: 200,
      }
    
})

export default SignupScreen;
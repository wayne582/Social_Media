import React, { Component } from 'react';
import { Text, ScrollView, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LogoutScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            token: ''
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });        
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

    logout = async () => {
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate("Login");
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return (
            <ScrollView style = {styles.container}>
                <Text style={{fontSize:18, fontWeight:'bold', padding:5, margin:5}}>Logout.</Text>
                <Text style={{fontSize:18, fontWeight:'bold', padding:5, margin:5}}>Are you sure, you want to logout</Text>
                <Button
                    title="Logout"
                    onPress={() => this.logout()}
                />
                <Button
                    title="Home"
                    //color="darkblue"
                    onPress={() => this.props.navigation.navigate("Home")}
                />
            </ScrollView>
        )
    }

    
}

const styles = StyleSheet.create({

    container: {
      flex: 1,
      height:"100%",
      backgroundColor:"#e8f3ec",  
     },
    });

export default LogoutScreen;
import React, { Component } from 'react';
import {Button, View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdatePost extends Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
           
            text:"",
            orig_text:"",
            DataToPass: {},
            postList: [], 
          }
        }    

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });   
        
        this.getPostData();
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

    getPostData = async () => {

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
                
                orig_text: responseJson.text,
              })
            })
            .catch((error) => {
                console.log(error);
            })
      }

    updatePost = async() => {

        let to_send = {};

        if (this.state.text != this.state.orig_text){
          to_send['text'] = this.state.text;
        }
      
        console.log(JSON.stringify(to_send)); 
        
        const token = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@session_id');
        const post_id = await AsyncStorage.getItem('@post_id');

        fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, {
           method: 'PATCH',
          'headers': {
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(to_send)
        })
        .then((response) => {
            if(response.status === 200){
                console.log("Updated post")
            }else if(response.status === 400){
                console.log("Bad Request");
            }else if(response.status === 401){
                onsole.log("Unauthorized");
            }else if(response.status === 403){
              console.log("Forbidden you can only update your your own posts")
            }
            else if(response.status === 404){
                console.log("post not found")
            }
            else if(response.status === 500){
                console.log("Error with server")
            }
            
            else{
                throw 'Server Error';
            }
        })
          .catch((error) => {
            console.log(error);
          })
        }
    
    render(){
        return (
          <View>
       
            <TextInput
                placeholder="Update text"
                onChangeText={(text) => this.setState({text})}
                //value={this.state.dataToPass.text}
            />
      
            <Button
                title="Update"
                onPress={() => this.updatePost()}
            />
        </View>
        )
    }
}

export default UpdatePost;
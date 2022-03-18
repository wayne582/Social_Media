import React, {Component} from 'react';
import {View, Text, FlatList, Button, Alert, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class SinglePost extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      postData: [],
      postUserId: '',
      ID: '',
      post: '',

    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      //this.getPost();
      console.log('first stage 1')
      console.log('first stage 2')
      this.getSinglePost();
      
    });
    
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getSinglePost = async () => {
    console.log('Checking method')
    //let to_send = {};
    const post_id = await AsyncStorage.getItem('@post_id');
    const thesessionID = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');
 
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id, {
           method: 'get',
          'headers': {
            'X-Authorization':  value,
            //'content-type': 'application/json'
          }
        })
        .then((response) => {
            if(response.status === 200){
              //console.log(response.json())
              return response.json();
            }else if(response.status === 401){
              console.log('Unauthorsied')
            }else if(response.status === 403){
              console.log('Can only view the posts of yourself or your friends')
            }else if(response.status === 404){
              console.log('Not found')
            }else if(response.status === 500){
              console.log('Server Error')
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
            postUserId: responseJson.author.user_id,

            isLoading: false,
            postData: responseJson,
            ID: thesessionID,
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }
 
  updatePost = async(post_id) => {

        let to_send = {}
        //to_send['text'] = this.state.post_Text
    
        console.log(JSON.stringify(to_send));
    
        const token = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@session_id');
    
        fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, {
            method: 'PATCH',
            headers: {
              'X-Authorization':  token,
              'content-type': 'application/json'
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
          if(response.status === 200){
              return response.json()
          }else if(response.status === 401){
            this.props.navigation.navigate("Login");
          }else if(response.status === 403){
            console.log("Cannot update other peoples posts")
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

  checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
        this.props.navigation.navigate('Login');
    }
  };

  DeletePost = async (post_id) => {

    const token = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@session_id');

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, {
           method: 'Delete',
          'headers': {
            'X-Authorization':  token
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else if(response.status === 403){
              console.log("You can only delete your own posts")
            }else if(response.status === 404){
              console.log("Post wasn't found")
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
        })
  }



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
      )
    }else{
    
      console.log(this.state.postData.text)
      return (
        <View>
     
         <TextInput
          defaultValue={(this.state.postData.text)}
          onChangeText={(text) => {this.setState({post:text})}}        
        />
                    
        </View>
      )

    
  }
}
  
}

export default SinglePost;
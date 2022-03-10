import React, {Component} from 'react';
import {View, Text, FlatList, Button, Alert, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Posts extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      postList: [],
      postUserId: '',
      post: '',
      ID: ''

    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      //this.getPost();
      this.getSinglePost;

    });
  
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getSinglePost = async () => {

    let to_send = {};
    const token = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@session_id');
    const post_id = await AsyncStorage.getItem('@post_id');
    const user_session_id = await AsyncStorage.getItem('@session_token');
 
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, {
           method: 'get',
          'headers': {
            'X-Authorization':  token,
            //'content-type': 'application/json'
          }
        })
        .then((response) => {
            if(response.status === 200){
                console.log(response.json())
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            postList: responseJson,
            postUserId: responseJson.author.user_id,
            ID: user_session_id
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
      );
    }else{
      return (
        <View>
          <FlatList
                data={this.state.postList}
                renderItem={({item}) => (
                    
                    <View>
                      <Text>Posts from: {item.text} </Text>
                      
                      <Button
                        title="Like post"
                        onPress={() => this.likePost(item.post_id)}
                      />

                      <Button
                        title="Dislike post"
                        onPress={() => this.DislikePost(item.post_id)}
                      />

                      <Button
                        title="Delete post"
                        onPress={() => this.DeletePost(item.post_id)}
                      />  

                      <Button
                            title="See post"
                            onPress={async () => {
                              await AsyncStorage.setItem('@post_id', item.post_id)
                              this.props.navigation.navigate("SinglePost")                     
                            }
                            }
                      />
 

                      <Button
                            title="Update post"
                            onPress={async () => {
                              await AsyncStorage.setItem('@post_id', item.post_id)
                              this.props.navigation.navigate("UpdatePost")                     
                            }
                            }
                      />

                  <Button
                    title="Share a post"
                    onPress={() => this.props.navigation.navigate("addAPostScreen")}
                  />

                  </View>
                )}
                keyExtractor={(item,index) => item.id}
              />        
                    
        </View>
      );
  }
  
}
}

export default Posts;
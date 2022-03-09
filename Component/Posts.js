import React, {Component} from 'react';
import {View, Text, FlatList, Button, Alert, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Posts extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      postList: [],
      postSingleList: [],
      post_Text:'',
      orig_post_text: '',
      Post_id: '',
      item_text: '',
      orig_item_text: '',
      item_text_add_post: '',
      validationPostText: '',
      postData: []

    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getPost();
    });
  
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getPost = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post" , {
           method: 'get',
          'headers': {
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else if(response.status === 403){
              console.log("Can only view posts from your friends or your own posts")
            }else if(response.status === 404){
              console.log("Can't be found")
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            postList: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  addPost = async () => {
    let to_send = {
      item_text_add_post: this.state.item_text_add_post,
    }
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post" , {
           method: 'post',
          'headers': {
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(to_send)
        })
        

      .then((response) => {
        console.log("check item has been added");
        Alert.alert("Item added");
        this.getPost();
      })
      .catch((error) => {
        console.log(error);
      })
    }

  getData = async () => {
      console.log("getting data...");
      const user_id = await AsyncStorage.getItem('@session_id');
      return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
        method: 'get',
       'headers': {
         'content-type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("checking");
        console.log(responseJson);
          this.setState({
              isLoading: false,
              postList: responseJson
          })
      })
      .catch((error) => {
        console.log('check errors');
          console.log(error);
       })
  }

  singlePost = async (post_id) => {

    let to_send = {
      post_id: parseInt(this.state.id),
    };
    const token = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@session_id');
 
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, {
           method: 'get',
          'headers': {
            'X-Authorization':  token,
            'content-type': 'application/json'
          }
        })
        .then((response) => {
            if(response.status === 200){
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
            postList: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  likePost = async (post_id) => {

    let to_send = {
      post_id: parseInt(this.state.id),
    };
    const token = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@session_id');

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
           method: 'post',
          'headers': {
            'X-Authorization':  token
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Can only like the posts of your friends';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            postSingleList: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  DislikePost = async (post_id) => {

    let to_send = {
      post_id: parseInt(this.state.id),
    };
    const token = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@session_id');

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
           method: 'delete',
          'headers': {
            'X-Authorization':  token
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Can only unlike the posts of your friends';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            postSingleList: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  updatePost = async(post_id) => {

    if(this.state.post_Text != ""){
      if (this.state.post_Text != this.state.postData.text){

        let to_send = {}
        to_send['text'] = this.state.post_Text
    
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

      }
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
                        onPress={() => this.singlePost(item.post_id)}
                      />    

                      <TextInput
                            onChangeText={(value) => this.setState({post_Text: value})}
                            defaultValue={this.state.postData.text}
                        />
                      <Button
                            title="Update post"
                            onPress={(value) => this.setState({editPost: value})}
                            value={this.state.editPost}
                            
                      />
                  <TextInput
                    placeholder="Make a post"
                    onChangeText={(item_text_add_post) => this.setState({item_text_add_post})}
                    value={this.state.item_text_add_post}
                  />

                  <Button
                    title="Share your thoughts"
                    onPress={() => this.addPost()}
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
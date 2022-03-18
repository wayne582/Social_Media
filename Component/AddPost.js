import React, {Component} from 'react';
import {View, Text, FlatList, Button, Alert, TextInput, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Posts extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      postList: [],
      post_text: "",
      post_orig_text: "",
      post: ''

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
    //const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post" , {
           method: 'get',
          'headers': {
            'Content-Type': 'application/json',
            'X-Authorization':  token
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

  addPost2 = async () => {
    
    let to_send = {
      text: this.state.post,
    };

    if (this.state.post_text != this.state.post_orig_text){
      to_send['post_text'] = this.state.post_text;
    }

    //console.log(JSON.stringify(to_send));

    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post" , {
           method: 'POST',
          'headers': {
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(to_send)
        })

        .then((response) => {
          if(response.status === 201){
              console.log("Item added");
              this.props.navigation.navigate("Home");
              //return response.json()
          }else if(response.status === 401){
              console.log("Unauthorised");
          }else if(response.status === 403){
              console.log("Not found")
          }else if(response.status === 500){
              console.log("Server Error")
          }else{
              throw 'Something went wrong';
          }
      })
     .catch((error) => {
          console.log(error);
      })
    }
//------------------------------------

addPost = async () => {
    
  const to_send = {
    text: this.state.post,
  };

  //console.log(JSON.stringify(to_send));

  const token = await AsyncStorage.getItem('@session_token');
  const id = await AsyncStorage.getItem('@session_id');
  return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post" , {
         method: 'POST',
        'headers': {
          'X-Authorization':  token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(to_send)
      })

      .then((response) => {
        if(response.status === 201){
            console.log("Item added");
            this.props.navigation.navigate("Home");
            //return response.json()
        }else if(response.status === 401){
            console.log("Unauthorised");
        }else if(response.status === 403){
            console.log("Not found")
        }else if(response.status === 500){
            console.log("Server Error")
        }else{
            throw 'Something went wrong';
        }
    })
   .catch((error) => {
        console.log(error);
    })
  }



    saveDraft = async () => {

      console.log("save draft function")
      
      const data = JSON.parse(await AsyncStorage.getItem('@draftPost'));
      
      if(data == null){
        const draftPost = [{text: this.state.post, id: 0}];
        await AsyncStorage.setItem('@draftPost', JSON.stringify(draftPost));
      }else{
        const index = data.length;
        const draftPost2 = { text: this.state.post, id: index};
        data.push(draftPost2);
        await AsyncStorage.setItem('@draftPost', JSON.stringify(data))
      }
      console.log(data)
    };

  checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render() {
    
      return (
        <View style = {styles.container}>        

         <TextInput
          placeholder="Make a post"
          onChangeText={(text) => this.setState({post:text})}
          //value={this.state.post_text}
         />

        <Button
          title="Add Post"
          onPress={() => this.addPost()}
        />

        <Button
          title="Save Draft"
          onPress={() => this.saveDraft()}                
        />

        <Button
          title="See Draft"
        //onPress={() => this.props.navigate.navigation('Draft')
          onPress={() => this.props.navigation.navigate("Draft")}                
        />
      </View>
     )}
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    height:"100%",
    backgroundColor:"#e8f3ec",  
   },
  
});

export default Posts;
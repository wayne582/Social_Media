import React, {Component} from 'react';
import {View, Text, FlatList, Button, Alert, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';


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
            postList: responseJson,
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
      const token = await AsyncStorage.getItem('@session_token');
      return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
        method: 'get',
       'headers': {
        'X-Authorization':  token,
         'content-type': 'application/json',
         
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
        <View style = {styles.container} >

          <Text style = {styles.title}> Discover something new with Spacebook </Text>

            <FlatList
              data={this.state.postList}
              renderItem={({item}) => (
                    
                <View style = {styles.postContainer}>
                    
                  <Text style = {styles.text}>
                    {item.text} 
                  </Text>

                  <Text>
                    {item.user_givenname} 
                    {item.user_familyname}
                  </Text>
                    
                  <TouchableOpacity
                    //style={styles.likePostButton}
                    style={styles.postButton}
                    onPress={() => this.likePost(item.post_id)}
                  >
                  <FontAwesome name="thumbs-o-up" size={30} color="black" />
                  
                  </TouchableOpacity>

                    <TouchableOpacity
                    
                      style={styles.postButton}
                      onPress={() => this.DislikePost(item.post_id)}
                    >
                    <FontAwesome name="thumbs-o-down" size={30} color="black" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => {this.props.navigation.navigate("UpdatePost"); }}
                  >
                  <FontAwesome name="pencil" size={20} color="black" />
                  
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => this.DeletePost(item.post_id)}
                  >
                  <FontAwesome name="trash" size={20} color="black" />
                  
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.singlePostButton}
                    onPress={async () => {
                      
                    await AsyncStorage.setItem('@post_id', item.post_id)
                    this.props.navigation.navigate("SinglePost"); 
                  
                  }}
                  >
                  <FontAwesome name="binoculars" size={15} color="black" />
                  
                  </TouchableOpacity>
                    
            </View>
                )}
                keyExtractor={(item,index) => item.id}
              />
          <View style = {styles.bottomContainer}>
          
          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate("addAPostScreen"); }}
            style={{
              borderBottomColor:this.state.popularSelected ? "#044244":"#FFF",
              borderBottomWidth:4,
              paddingVertical:6
            }}
            >
            <Text style={{
              fontFamily:"Bold",
              color:this.state.popularSelected ? "#044244":"#9ca1a2"
            }}>SHARE POST</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.setItem('@post_id', item.post_id)
                this.props.navigation.navigate("SinglePost")
              }}      
              style={{
                borderBottomColor:this.state.popularSelected ? "#FFF":"#044244",
                borderBottomWidth:4,
                paddingVertical:6,
                marginLeft:30
              }}
              >
              <Text style={{
                fontFamily:"Bold",
                color:this.state.popularSelected ? "#9ca1a2":"#044244"
              }}>SEE POST</Text>
            </TouchableOpacity>
            

          </View>
                    
        </View>
      );
  }
  
}
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    height:"100%",
    backgroundColor:"#e8f3ec",  
   },

   text: {
    fontFamily:"Bold",
    color: "Black",
    fontFamily: 'notoserif',
    fontWeight: 'normal',
    fontSize: 22,
   },

   bottomContainer: {
    backgroundColor:"#FFF",
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    height:90,
    paddingHorizontal:35
   },

   SharePostButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },

  title: {
    fontFamily:"Bold",
    fontSize:22,
    color:"black",
    paddingVertical:25,
    fontFamily: 'Courier New',
    fontWeight: 'normal',
  },

  //post container styling
  postContainer: {
    //flex: 1,
    height: 80,
    backgroundColor: 'white',
    //alignItems: 'center',
    justifyContent: 'center',
    //borderBottomColor: 'black',
    //borderWidth: 1,
    flexDirection: 'row',
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
    
  },

  postButton:  {
    //height:"100%",
    flex: 1, 
    right: -10,
    top: 5,
    flexDirection:"row",
    //alignItems:'center',
    justifyContent: "flex-end",
  },

  updateButton: { 
    //flex: 1, 
    right: 340,
    top: 30,
    flexDirection:"row",
    alignItems:'center',
    justifyContent: "flex-end",
  },

  deleteButton: {
    right: 335,
    top: 30,
    flexDirection:"row",
    alignItems:'center',
    justifyContent: "flex-end",
  },

  singlePostButton: { 
    right: 328,
    top: 63,
    flexDirection:"row",
    //alignItems:'center',
    justifyContent: "flex-end",
  }
  
});

export default Posts;
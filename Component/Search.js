import React, {Component} from 'react';
import {View, Text, FlatList, TextInput, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class HomeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      first_name: "",
      last_name: ""
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async (first_name) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/search?q=" + first_name, {
          'headers': {
            'X-Authorization':  value
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
            listData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  
  handleSearch = (first_name) =>{
    //validation will be carried out here for the email
    this.setState({first_name: first_name})
  }


  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  SendFriendRequest = async (friendrequestsId) => {

    const token = await AsyncStorage.getItem('@session_token');
    //const userId = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + friendrequestsId +"/friends" , {
        method: 'POST',
          'headers': {
            'X-Authorization':  token
          },
          
        })
        .then((response) => {
          if(response.status === 201){
            console.log("Friend request has been sent")
          }else if (response.status === 401){
            console.log("Unauthorised")
          }else if (response.status === 403){
            console.log("User is already added as a friend")
          }else if (response.status === 404){
            console.log("Not Found")
          }else if (response.status === 500){
            console.log("Server Error")
          }else{
            throw 'something went wrong';
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
          <TextInput        
                placeholder = 'Search' 
                onChangeText={this.handleSearch}
                value = {this.state.first_name}
              />  
            
            <Button
                title="Search"
                onPress = {() => this.getData(this.state.first_name)}
            />    
          <FlatList
                data={this.state.listData}
                renderItem={({item}) => (
                    <View>
                      <Text style = {styles.text}>{item.user_givenname} {item.user_familyname}</Text>

                      <Button
                      title='Send friend request'
                      onPress={() => this.SendFriendRequest(item.user_id)}
                    />
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
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
    height:70,
    paddingHorizontal:35
   },



});



export default HomeScreen;
import React, {Component} from 'react';
import {View, Text, FlatList, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class AllFriends extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      AllFriendsList: []

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

  getAllData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId +"/friends", {
           method: 'get',
          'headers': {
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
            if(response.status === 200){
                console.log("Ok")
                console.log(response)
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else if(response.status === 403){
              console.log("You can only view friends of yourself or your friends")
            }
            else if(response.status === 404){
                console.log("You have no friends")
            }
            else if(response.status === 500){
                console.log("Error with server")
            }
            
            else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            AllFriendsList: responseJson
          })
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
                data={this.state.AllFriendsList}
                renderItem={({item}) => (
                    <View>
                      <Text>List of friends: {item.user_givenname} {item.user_familyname}</Text>

                      <Button
                        title='Friend requests'
                        onPress={() => this.props.navigation.navigate('Friends')}

                      />

                    </View>
                )}
                //keyExtractor={(item,index) => item.user_id.toString()}
              />
        </View>
      );
    }
  }
}

export default AllFriends;
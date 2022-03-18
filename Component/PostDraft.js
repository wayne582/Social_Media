import React, {Component} from 'react';
import {View, Text, FlatList, Button, ScrollView, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import DatePicker from 'react-native-datepicker';

class PostDraft extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      //isLoading: true,
      postData: [],
      draft: [],
      date: '',
      
    }
  }
  
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    
    this.getPost();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  
  addPost = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    
    const to_Send = {
      text:this.state.postData,
    }
    
    getPost = async () => {
      const currentDraft = JSON.parse(await AsyncStorage.getItem('@currentDraft'));
      this.setState({draft: currentDraft});
      
    }
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post" , {
           method: 'POST',
          'headers': {
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(to_Send)
        })

        .then((response) => {
          if(response.status === 201){
              console.log("Item added");
              this.props.navigation.navigate("Home");
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
 
  checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
        this.props.navigation.navigate('Login');
    }
  };  

  //const [date, setDate] = useState(new Date())
  //const [date, setDate] = setState(new Date())
  
  render() {
      return (
        <View>
            <TextInput
                defaultValue = {(this.state.draft.text)}
                onChangeText = {(text) => this.setState({ postData: text})}
            />

            <Button
                title='Post'
                onPress={() => this.addPost()}
            />
        
        
        </View>
      );
    }
  
}

export default PostDraft;
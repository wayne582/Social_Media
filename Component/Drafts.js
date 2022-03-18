import React, {Component} from 'react';
import {View, Text, FlatList, Button, SafeAreaView,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Drafts extends Component {
  constructor(props){
    super(props);

    this.state = {
      //isLoading: true,
      draftData: []

    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getDraft();
    });
    
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getDraft = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('@draftPost'));
    this.setState({draftData: data});

    console.log(data)
    
  };

  saveDraft = async (item) => {
    console.log('post draft checking')
    await AsyncStorage.setItem('@currentDraft', JSON.stringify(item));
    //this.props.navigation.navigate('PostDraft');
    this.props.navigation.navigate('postDraft');
    
  };

  deleteDraft = async (item) => {
    const drafts = JSON.parse(await AsyncStorage.getItem('@draftPost'));
    const newDrafts = [];

    for(let i = 0; i < drafts.length; i += 1){
        const draftText = drafts[i].text;
        const draftID = drafts[i].id;
        if(draftID !== item) {
            newDrafts.push({id: draftID, text: draftText});
        } 
    }
    await AsyncStorage.setItem('@draftPost', JSON.stringify(newDrafts));
    this.getDraft();
  }
 
  checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
        this.props.navigation.navigate('Login');
    }
  };  
  
  render() {
    console.log(this.state.draftData)
      return (
        <SafeAreaView>
          <Text> Checking if this works </Text>
              <FlatList
                data={this.state.draftData}
                renderItem={({item}) => (                
                  <View>
                   
                    <Text>
                        {item.text}
                    </Text>

                    <Button
                      title='Share Draft'
                      onPress={() => this.saveDraft(item)}
                    />

                    <Button
                      title='Delete Draft'
                      onPress={() => this.deleteDraft(item.id)}
                    />

                  </View>
                )}
                keyExtractor={(item) => item.text.toString()}
              />

        </SafeAreaView>
      );
    }
  
}

export default Drafts;
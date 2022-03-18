import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native';


import LoginScreen from '../Component/Login';
//import HomeScreen from '../Component/Home';
import SignUpScreen from '../Component/SignUp';
import BottomTabNavigator from './TabNavigation';
import LogoutUser from '../Component/Logout';
import UpdateScreen from '../Component/UpdateUserDetails';
import UpdatePostScreen from '../Component/UpdatePost';
import AddPostScreen from '../Component/AddPost';
import SinglePostScreen from '../Component/SinglePost';
import FriendRequestScreen from '../Component/FriendRequests';
import CamerasScreen from '../Component/CameraScreen';
import DraftScreen from '../Component/Drafts';
import postDraftScreen from '../Component/PostDraft';
import logoutScreen from '../Component/Logout';
//import postDraftScreen from "../Component/PostDraftDateTime";

const Stack = createNativeStackNavigator();

const screenOptionStyle = {
    headerStyle: {
      backgroundColor: "#e2e6e1",
    },
    headerTintColor: "white",
    headerBackTitle: "Back",
  };

const Navigator = () => {
    return (
        <Stack.Navigator initialRouteName='Login'>          
          <Stack.Screen name = "Login" component={LoginScreen} />
          <Stack.Screen name = "SignUp" component={SignUpScreen} />
          <Stack.Screen name = "UpdateUserProfile" component={UpdateScreen} />
          <Stack.Screen name = "addAPostScreen" component={AddPostScreen} />
          <Stack.Screen name = "UpdatePost" component={UpdatePostScreen} />
          <Stack.Screen name = "SinglePost" component={SinglePostScreen} />
          <Stack.Screen name = "FriendRequest" component={FriendRequestScreen} />
          <Stack.Screen name = "Camera" component={CamerasScreen}/>
          <Stack.Screen name = "Draft" component={DraftScreen}/>
          <Stack.Screen name = "postDraft" component={postDraftScreen}/>
          <Stack.Screen name = "Logout" component={logoutScreen}/>
          
          <Stack.Screen name = "Home" component={BottomTabNavigator}
          
          options={{
          title: 'Spacebook',
          headerTitleAlign:'center',
          headerStyle: {
          backgroundColor: '#ffffff',
          },
          headerTintColor: '#e2e6e1',
          headerTitleStyle: {
          fontWeight: 'bold',
          },

      
          }}/>
        </Stack.Navigator>
    );  
}

export {Navigator};
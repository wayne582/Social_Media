import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native';


import LoginScreen from '../Component/Login';
//import HomeScreen from '../Component/Home';
import SignUpScreen from '../Component/SignUp';
import BottomTabNavigator from './TabNavigation';
import LogoutUser from '../Component/Logout';
import Update from '../Component/Update';

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
          <Stack.Screen name = "Home" component={BottomTabNavigator}
          
          options={{
          title: 'Spacebook',
          headerTitleAlign:'center',
          headerStyle: {
          backgroundColor: '#e2e6e1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold',
          },
          headerRight: () => (
            <Button
              title="Logout"
              color="Black"
              onPress={() => this.LogoutUser}
            />
          ),
      
          }}/>
        </Stack.Navigator>
    );  
}

export {Navigator};
import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-ionicons'

//import { Navigator, CameraStackNavigator } from "./Navigate";
import HomeScreen from "../Component/Home";
import CameraScreen from "../Component/Camera";
import ProfileScreen from "../Component/ProfileScreen";
//import UpdateUserScreen from "../Component/UpdateUser";
import SearchScreen from "../Component/Search";
import FriendsScreen from "../Component/Friends";
//import FriendsScreen from "../Component/AllFriends";
import UpdateUserScreen from "../Component/Update";
//import ProfilePicture from "../Component/ProfilePicture";
import ProfilePicture from "../Component/UserProfile";
//import ProfilePicture from "../Component/UpdateUserDetails";
import PostScreen from "../Component/Posts";
//import ListScreen from "../Component/ListFriends";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions = {
        {headerShown: false, 
        tabBarShowLabel: true,
        tabBarStyle: {backgroundColor: '#ffffff'},
        tabBarInactiveTintColor:'#fff',
    }
        }>
   <Tab.Screen
          name="Home"
          component={PostScreen}
          options={{
            title: 'Home',
            tabBarIcon: ({size,focused,color}) => {
              return (
                <Image
                  style={{ width: size, height: size }}
                  source={{
                    uri:
                      'https://icon-library.com/images/home-icon-transparent/home-icon-transparent-18.jpg',
                  }}
                />
              );
            },
          }}
        />
      
          <Tab.Screen
          name="Friends"
          component={FriendsScreen}
          options={{
            title: 'Friends',
            tabBarIcon: ({size,focused,color}) => {
              return (
                <Image
                  style={{ width: size, height: size }}
                  source={{
                    uri:
                      'https://static.thenounproject.com/png/28129-200.png',
                  }}
                />
              );
            },
          }}
        />

          <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: 'Search',
            tabBarIcon: ({size,focused,color}) => {
              return (
                <Image
                  style={{ width: size, height: size }}
                  source={{
                    uri:
                      'https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-5.png',
                  }}
                />
              );
            },
          }}
        />
           <Tab.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            title: 'Camera',
            tabBarIcon: ({size,focused,color}) => {
              return (
                <Image
                  style={{ width: size, height: size }}
                  source={{
                    uri:
                      'https://www.freeiconspng.com/thumbs/camera-icon/camera-icon-21.png',
                  }}
                />
              );
            },
          }}
        />
         <Tab.Screen
          name="Update Profile"
          component={ProfilePicture}
          options={{
            title: 'Update Profile',
            tabBarIcon: ({size,focused,color}) => {
              return (
                <Image
                  style={{ width: size, height: size }}
                  source={{
                    uri:
                      'https://www.freeiconspng.com/thumbs/profile-icon-png/account-profile-user-icon--icon-search-engine-10.png',
                  }}
                />
              );
            },
          }}
        />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
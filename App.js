import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { Navigator } from "./Navigation/Navigate";
//import BottomTabNavigator from "./Navigation/TabNavigation";

 const App = () => {
  return (
    <NavigationContainer>
      <Navigator/>
    </NavigationContainer>
  );
}
export default App
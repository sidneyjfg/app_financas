import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Home' }} 
        />
        <Stack.Screen 
          name="Report" 
          component={ReportScreen} 
          options={{ title: 'Relatório' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;

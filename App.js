import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import AddChat from './screens/AddChat';
import Chat from './screens/Chat';

export default function App() {
  const Stack = createNativeStackNavigator()
  const globalScreenOptions = {
    headerStyle: {
      backgroundColor: "blue",
    },
    headerTitleStyle: {
      color: "white"
    },
    headerTintColor: "white"
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={globalScreenOptions}>
        <Stack.Screen name='Login' component={Login}></Stack.Screen>
        <Stack.Screen name='Register' component={Register}></Stack.Screen>
        <Stack.Screen name='Home' component={Home}></Stack.Screen>
        <Stack.Screen name='AddChat' component={AddChat}></Stack.Screen>
        <Stack.Screen name='Chat' component={Chat}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

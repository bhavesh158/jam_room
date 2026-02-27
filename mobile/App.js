import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SocketProvider } from './src/context/SocketContext';
import ConnectScreen from './src/screens/ConnectScreen';
import PollScreen from './src/screens/PollScreen';
import ResultsScreen from './src/screens/ResultsScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <SocketProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Connect"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Connect" component={ConnectScreen} />
          <Stack.Screen name="Poll" component={PollScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketProvider>
  );
}

export default App;

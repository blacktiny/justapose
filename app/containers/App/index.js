/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import Home from '../Home';
import ViewController from '../ViewController';

const Stack = createStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="ViewController" component={ViewController} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function App() {
  const ref = React.useRef(null);

  return (
    <NavigationContainer ref={ref}>
      <RootStack />
    </NavigationContainer>
  );
}

export default App;

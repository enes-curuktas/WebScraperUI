import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { constantUrls } from '../constant/constantUrls';
import Login from '../components/Login';

const Stack = createNativeStackNavigator();

const AuthRouter = ({ setIsLoggedIn }) => {
  return (
    <Stack.Navigator initialRouteName={constantUrls.login}>
      <Stack.Screen
        name={constantUrls.login}
        options={{ headerShown: false }}
      >
        {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthRouter;

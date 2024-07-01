import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthRouter from './src/routers/AuthRouter';
import PageRouter from './src/routers/PageRouter';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      if (loginStatus === 'true') {
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? <PageRouter /> : <AuthRouter setIsLoggedIn={setIsLoggedIn} />}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { constantUrls } from '../constant/constantUrls';
import Chat from '../components/Chat';

const Stack = createNativeStackNavigator();

const PageRouter = () => {
    return (
        <Stack.Navigator initialRouteName={constantUrls.chat}>
            <Stack.Screen
                name={constantUrls.chat}
                component={Chat}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default PageRouter;

import { useEffect, useState, useContext } from 'react';
import { useFonts } from 'expo-font' ;
import { createStackNavigator} from '@react-navigation/stack'
import { NavigationContainer , DefaultTheme } from '@react-navigation/native'
import 'react-native-gesture-handler';
import HomeNavigator from './screens/HomeNavigator';
import Login from './screens/Login';
import Signup from './screens/Signup';
import ForgotPassword from './screens/ForgotPassword';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import {auth} from './firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Details from './screens/Details';
import Post from './screens/Post';

const Stack = createStackNavigator () ;

  
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent'
    }
  }
  
  const App = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    
    useEffect(()=>{
      const getLoginState = () => {
        // console.log('use effect running');
        try{
          AsyncStorage.getItem('LoggedIn')
          .then(value => {
            // console.log(value);
            if(value === 'true'){
              setLoggedIn(true);
            }
            else{
              setLoggedIn(false)
            }
          })
        }catch(err){
          console.log(err);
        }
      }
      getLoginState()
    },[])
    
    const [loaded] = useFonts({
      PoppinsMedium: require('./assets/fonts/Poppins-Medium.ttf'),
      PoppinsSemiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
      PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
    })
    
    if(!loaded) return null;

         return (
           <SafeAreaProvider>
           <NavigationContainer theme={theme}>
              <Stack.Navigator initialRouteName={loggedIn ? 'Home': 'Login'}>
                <Stack.Group>
                <Stack.Screen options={{headerShown: false}} name={'Login'} component={Login}/>
                <Stack.Screen options={{headerShown: false}} name='Signup' component={Signup}/>
                <Stack.Screen options={{headerShown: false}} name='ForgotPassword' component={ForgotPassword}/>
                </Stack.Group>
                <Stack.Group>
                <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeNavigator}/>
                <Stack.Screen options={{ headerShown: false }} name="Post" component={Post}/>
                </Stack.Group>
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        )
      }
export default App;
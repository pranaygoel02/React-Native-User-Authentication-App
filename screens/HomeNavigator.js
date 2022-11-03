import React,{useState,useEffect} from 'react';
import {StyleSheet,Image,View,Text,TouchableOpacity} from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import Details from './Details';
import Feed from './Feed';
import 'react-native-gesture-handler';
import DrawerContent from './DrawerContent';
import Post from './Post';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {auth} from '../firebase'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

const Header = ({props}) =>{
  const navigation = useNavigation()
  const route = useRoute()
  const [photo, setPhoto] = useState(auth.currentUser?.photoURL)
  useEffect(()=>{
    setPhoto(prev=>auth.currentUser?.photoURL)
  },[auth.currentUser?.photoURL])

  return (
    <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',width:'100%',alignItems:'center'}}>
    <Image
    style= {{height: 50,width:100,resizeMode:'contain'}}
      source={require('../assets/logo.png')}
      />
      <TouchableOpacity style={[route.name === 'Profile' && {opacity:0}]} onPress={()=>{navigation.navigate('Profile')}}>
      {photo ? <Image style={{width:36,height:36,borderRadius:300}} source={{uri:photo}}/> : <MaterialIcons name='account-circle' size={36} color='gray'/>}
      </TouchableOpacity>
      </View>
  );
}


const HomeNavigator = ({navigation, user}) => {

  return (
    // <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>} 
    // backBehavior='order' 
    // screenOptions={
    //   {
    //     swipeEdgeWidth: 500 ,
    //     drawerType: 'slide',
    //     overlayColor: 'transparent',
    //   }
    // }>
    //   <Drawer.Screen options={{headerShown: false}} name="Feed" component={Feed} />
    //   {/* <Drawer.Screen options={{headerShown: false}} name="Post" component={Post} /> */}
    //   <Drawer.Screen options={{headerShown: false}} name="My Posts" component={Details} />
    // </Drawer.Navigator>
    <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown:true,
      headerTitle: (props) => <Header {...props}/>,
      // tabBarShowLabel:false,
      tabBarAllowFontScaling:true,
      tabBarStyle:{height:60,paddingBottom:8},
      tabBarLabelStyle:{fontSize:12},
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused
            ? 'home-variant'
            : 'home-variant-outline';
        } else if(route.name === 'Posts'){
          iconName = focused ? 'view-list' : 'view-list-outline';
        }
        else{
          iconName = focused ? 'account' : 'account-outline';
        }

        // You can return any component that you like here!
        return <MaterialCommunityIcons style={[{marginBottom:-4}]} name={iconName} size={30} color={color} />;
      },
      tabBarActiveTintColor: 'rgb(25, 134, 214)',
      tabBarInactiveTintColor: 'gray',
    })}>
    <Tab.Screen  name="Home" component={Feed} />
    <Tab.Screen  name="Posts" component={Details} />
    <Tab.Screen name="Profile" component={DrawerContent} />
  </Tab.Navigator>
  )
}

export default HomeNavigator

const styles = StyleSheet.create({
  
})
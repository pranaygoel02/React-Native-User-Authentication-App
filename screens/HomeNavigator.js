import {StyleSheet} from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Details from './Details';
import Feed from './Feed';
import 'react-native-gesture-handler';
import DrawerContent from './DrawerContent';
import Post from './Post';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

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
    <Tab.Screen options={{headerShown: false}} name="Home" component={Feed} />
    <Tab.Screen options={{headerShown: false}} name="Posts" component={Details} />
    <Tab.Screen name="Profile" component={DrawerContent} />
  </Tab.Navigator>
  )
}

export default HomeNavigator

const styles = StyleSheet.create({
  
})
import {StyleSheet} from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Details from './Details';
import Feed from './Feed';
import 'react-native-gesture-handler';
import DrawerContent from './DrawerContent';
import Post from './Post';

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

const HomeNavigator = ({navigation, user}) => {

  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>} 
    backBehavior='order' 
    screenOptions={
      {
        swipeEdgeWidth: 500 ,
        drawerType: 'slide',
        overlayColor: 'transparent',
      }
    }>
      <Drawer.Screen options={{headerShown: false}} name="Feed" component={Feed} />
      {/* <Drawer.Screen options={{headerShown: false}} name="Post" component={Post} /> */}
      <Drawer.Screen options={{headerShown: false}} name="My Posts" component={Details} />
    </Drawer.Navigator>
  )
}

export default HomeNavigator

const styles = StyleSheet.create({
  
})
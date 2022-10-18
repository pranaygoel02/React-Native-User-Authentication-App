import {StyleSheet} from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Details from './Details';
import Feed from './Feed';
import Test from './test'
import 'react-native-gesture-handler';
import DrawerContent from './DrawerContent';

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
      <Drawer.Screen options={{headerShown: false}} name="Details" component={Details} />
      <Drawer.Screen options={{headerShown: false}} name="Test" component={Test} />
    </Drawer.Navigator>
  )
}

export default HomeNavigator

const styles = StyleSheet.create({
  
})
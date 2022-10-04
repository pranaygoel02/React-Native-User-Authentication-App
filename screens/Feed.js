import { StyleSheet, Text, View, RefreshControl, ScrollView } from 'react-native'
import {auth} from '../firebase'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};


const Feed = ({navigation,route}) => {
  console.log('auth.currentUser?.email: ', auth.currentUser?.email);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(()=>{
    onRefresh()
  },[])


  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Text style={auth.currentUser?.emailVerified && styles.verified}>{auth.currentUser?.email}</Text>
      <Text>Hello</Text>
      </ScrollView>
      
    
    </SafeAreaView>
  )
}

export default Feed

const styles = StyleSheet.create({
    verified:{
        color: 'green'
      }
})
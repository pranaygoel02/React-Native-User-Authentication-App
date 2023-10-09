import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

function Alert({children}) {
  return (
    <>
        {children}
        <View style={styles.alert}>
            <Text>Alety</Text>
        </View>
    </>
  )
}

const styles = StyleSheet.create({
    alert:{
        backgroundColor: 'red',
        color: 'white',
        padding: 12,
        borderRadius: 6,
        margin: 12,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        position: 'absolute',
    }
})

export default Alert
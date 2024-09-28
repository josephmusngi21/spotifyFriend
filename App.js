import { FlatList, StyleSheet, Text, View } from 'react-native';
import { handleAuth, redirectToAuthCodeFlow, getAccessToken } from './assets/script';
import React, { useState } from 'react';


export default function App() {
  // TODO: import userData and grab info about songs
  const [user, setUser] = useState('');
  // dictionary of the songs including how many times its played 
  const songs = {};

  // TODO: import function that will check if the same song has been played and if it has it will add a count to the dictionary


  return (
    <View style={styles.container}>
      <Text>{user}</Text>
      <FlatList data={userData}></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

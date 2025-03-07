import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import * as SplashScreen from "expo-splash-screen";
import { useLocalSearchParams } from "expo-router";

export default function otheruserofile() {

  const item = useLocalSearchParams();

  const [loaded, error] = useFonts({
    "NunitoLight": require("../assets/fonts/Nunito-Light.ttf"),
    "NunitoSemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
  });

  useEffect(
    () => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]
  );

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
        <Pressable onPress={
          () => {
            router.push("/chat");
          }
        } style={styles.backIcon}>
          <FontAwesome6 name={"chevron-left"} size={25} color={"#4A90E2"} />
        </Pressable>
        <Text style={styles.header}>Edit Profile</Text>
               
      <View style={styles.profilePicContainer}>
        <Image source={{ uri: "http://192.168.8.137:8080/VibeTalk/Images/" + item.other_user_mobile + ".png" }} style={styles.profilePic} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Mobile</Text>
        <Text style={styles.label1}>{item.other_user_mobile}</Text>

        <Text style={styles.label}>Name</Text>
        <Text style={styles.label1}>{item.other_user_name}</Text>

      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 20,
  },
  backIcon:{
    marginTop:20,
    position:"absolute",
    paddingHorizontal:20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    marginBottom: 40,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 40,
  },
  infoContainer: {
    marginBottom: 40,
  },
  label: {
    fontSize: 20,
    color: 'black',
    fontFamily: "NunitoSemiBold",
    marginBottom: 5,
    textAlign: 'center',
  },
  label1: {
    fontSize: 18,
    color: '#333333',
    fontFamily: "NunitoLight",
    marginBottom: 20,
    marginTop:10,
    borderBottomWidth: 3,
    borderColor: '#E0E0E0',
    textAlign: 'center',
  },
 
});

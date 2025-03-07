import { StatusBar } from 'expo-status-bar';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function signin() {

  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");

  const nu = useLocalSearchParams();


  const [loaded, error] = useFonts({
    "NunitoLight": require("../assets/fonts/Nunito-Light.ttf"),
    "NunitoSemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
  });

  useEffect(
    () => {
      async function checkUserInAsyncStorage() {
        try {
          let userJson = await AsyncStorage.getItem("user");
          if (userJson != null) {
            router.replace("/home");
          }
        } catch (e) {
          console.log(e);
        }
      }
      checkUserInAsyncStorage();
    }, []

  );

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
  const logopath = require("../assets/icon.png");

  return (
    <View style={styles.viwe1}>
      <StatusBar hidden={true} />


      <View style={styles.view2}>

        <Image source={logopath} style={styles.image1} contentFit={"cover"} />
        <Text style={styles.text1}>VibeTalk</Text>

        <View style={styles.view4}>
          <Text style={styles.text2}>Welcome</Text>
          <Text style={styles.text3}>Talk Freely, Vibe Together...</Text>
        </View>

      </View>

      <View style={styles.view3}>

        <Text style={styles.text3}>Mobile</Text>
        <TextInput style={styles.input1} inputMode={"tel"} maxLength={10} placeholder="07xxxxxxxx" onChangeText={
          (text) => {
            setMobile(text);
          }
        } />

        <Text style={styles.text3}>Password</Text>
        <TextInput style={styles.input1} placeholder="xxxxxxxx" secureTextEntry={true} maxLength={20} onChangeText={
          (text) => {
            setPassword(text);
          }
        } />

        <View style={styles.view5}>
          <Pressable style={styles.pressable1} onPress={async () => {

            let response = await fetch(
              "http://192.168.8.137:8080/VibeTalk/SignIn",
              {
                method: "POST",
                body: JSON.stringify(
                  {
                    mobile: getMobile,
                    password: getPassword,
                  }
                ),
                headers: {
                  "Content-Type": "application/json"
                }
              }
            );
            if (response.ok) {
              let json = await response.json();

              if (json.success) {
                //user sign in complete
                let user = json.user;
                try {
                  await AsyncStorage.setItem("user", JSON.stringify(user));
                  router.replace("/home");

                } catch (e) {
                  Alert.alert("Error", "Unable to process your request");
                }
              } else {
                //problem occred
                Alert.alert("Error", json.message);
              }
            }
          }
          }>
            <Text style={styles.text4}>Sign In</Text>
          </Pressable>
        </View>

      </View>
    </View >

  );
}


const styles = StyleSheet.create({
  viwe1: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 20,
  },
  view2: {
    flex: 1,
    justifyContent: "center",
  },
  view3: {
    flex: 1,
    rowGap: 10,
  },
  view4: {
    paddingTop: 10,
  },
  text1: {
    fontSize: 60,
    fontFamily: "NunitoSemiBold",
    textAlign: "center",
  },
  text2: {
    fontSize: 40,
    fontFamily: "NunitoLight",
  },
  text3: {
    fontSize: 30,
    fontFamily: "NunitoLight",
  },
  text4: {
    fontSize: 25,
    fontFamily: "NunitoSemiBold",
    color: "white",
  },
  view5: {
    paddingTop: 20,
    alignItems: "center",
  },
  input1: {
    width: "100",
    height: 50,
    borderStyle: "solid",
    borderRadius: 15,
    borderWidth: 2,
    paddingStart: 10,
    fontSize: 18,
    fontFamily: "NunitoSemiBold",
    borderColor: "#384B70"
  },
  pressable1: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  image1: {
    width: "100%",
    height: 160,
  },

});


import { StatusBar } from 'expo-status-bar';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function index() {

  const [getMobile, setMobile] = useState("");

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

        <View style={styles.view5}>
          <Pressable style={styles.pressable1} onPress={async () => {

            let response = await fetch(
              "http://192.168.8.137:8080/VibeTalk/Index",
              {
                method: "POST",
                body: JSON.stringify(
                  {
                    mobile: getMobile,
                  }
                ),
                headers: {
                  "Content-Type": "application/json"
                }
              }
            );
            if (response.ok) {
              let json = await response.json();

              if (json.signin) {
                try {             
                  //go to sign in  
                  router.replace({
                    pathname: "/signin",
                    params: { nu: getMobile }
                  });
                } catch (e) {
                  Alert.alert("Error", "Unable to process your request");
                }
              } else if(json.signup){
                //go to sign up
                router.replace({
                  pathname: "/signup",
                  params: { item: getMobile }
                });
              } else {
                //problem occred
                Alert.alert("Error", json.message);
              }
            }
          }
          }>
            <FontAwesome6 name={"arrow-right"} size={40} color={"white"} />
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
    height: 80,
    width: 80,
    marginTop: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#4A90E2',
  },
  image1: {
    width: "100%",
    height: 160,
  },

});


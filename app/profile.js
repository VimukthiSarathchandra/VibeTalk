import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, Pressable, Alert, } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import * as SplashScreen from "expo-splash-screen";
import * as ImagePicker from 'expo-image-picker';

export default function profile() {

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    password: '',
  });

  const [getImage, setImage] = useState(null);
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

  const [storageData, setStorageData] = useState([]);

  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        if (keys.length > 0) {
          const result = await AsyncStorage.multiGet(keys);
          setStorageData(result);
        }
      } catch (error) {
        console.error("Error fetching keys and values from AsyncStorage:", error);
      }
    };
    fetchStorageData();
  }, []);


  const [loaded, error] = useFonts({
    "NunitoLight": require("../assets/fonts/Nunito-Light.ttf"),
    "NunitoSemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData !== null) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error("Failed to load user data:", e);
      }
    };

    fetchUserData();
  }, []);


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
  // const profilePic = require('../assets/gg.jpg');

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      {/* back */}
      <Pressable onPress={
        () => {
          router.push("/home");
        }
      } style={styles.backIcon}>
        <FontAwesome6 name={"chevron-left"} size={25} color={"#4A90E2"} />
      </Pressable>
      {/* back */}

      <Text style={styles.header}>Edit Profile</Text>

      {/*log out */}
      <Pressable onPress={
        async () => {
          try {
            await AsyncStorage.removeItem("user");
            router.replace('/');
          } catch (error) {
            console.error("Error logging out:", error);
          }
        }
      } style={styles.logOutIcon}>
        <FontAwesome6 name={"right-from-bracket"} size={25} color={"#FF3B30"} />
      </Pressable>
      {/*log out */}

      {/*profile image */}
      <View style={styles.profilePicContainer}>
        <Pressable
          onPress={async () => {
            let result = await ImagePicker.launchImageLibraryAsync({});
            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          }}
          style={styles.pressable2}
        >
          {getImage ? (
            <Image source={{ uri: getImage }} style={styles.profilePic} />
          ) : (
            <Image source={{ uri: "http://192.168.8.137:8080/VibeTalk/Images/" + user.mobile + ".png" }} style={styles.profilePic} />
          )}
        </Pressable>
        <View style={styles.cameraIcon}>
          <FontAwesome name="camera" size={20} color="white" />
        </View>
      </View>
      {/*profile image */}

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Mobile</Text>
        <TextInput
          style={styles.infoText}
          inputMode={"tel"} maxLength={10}
          value={user.mobile}
          editable={false}
        />

        <Text style={styles.label}>Frist Name</Text>
        <TextInput
          style={styles.infoText}
          inputMode={"text"} maxLength={20}
          placeholder={user.first_name}
          onChangeText={(text) => setFirstName(text)}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.infoText}
          inputMode={"text"}
          maxLength={20}
          placeholder={user.last_name}
          onChangeText={(text) => setLastName(text)}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.infoText}
          secureTextEntry={true}
          maxLength={20}
          placeholder={"********"}
          onChangeText={(text) => {
            setPassword(text);
          }}
        />
      </View>

      <View style={styles.view5}>
        <Pressable style={styles.pressable1}
          onPress={async () => {

            if (getImage === null) {
              Alert.alert("Error", "Please upload your profile picture.");
              return; 
            }

            let form = new FormData();
            form.append("fname", getFirstName);
            form.append("lname", getLastName);
            form.append("password", getPassword);
            form.append("mobile", user.mobile);
            if (getImage) {
              form.append("userImg", {
                uri: getImage,
                name: "userImg",
                type: "image/png",
              });
            }

            let response = await fetch(
              "http://192.168.8.137:8080/VibeTalk/UpdateProfile",
              {
                method: "POST",
                body: form,
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (response.ok) {
              let results = await response.json();
              console.log(results);

              if (results.success) {
                let user = results.user;
                await AsyncStorage.setItem("user", JSON.stringify(user));
                Alert.alert("Message", "Profile Update Successfull");
                router.replace("/profile");
              } else {
                Alert.alert("Error", results.message);
              }
            }
          }}
        >
          <Text style={styles.text4}>Update Profile</Text>
        </Pressable>
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
  pressable2: {
    backgroundColor: '#4A90E2',
    height: 80,
    width: 80,
    marginTop: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    marginTop: 20,
    position: "absolute",
    paddingHorizontal: 20,
  },
  logOutIcon: {
    paddingEnd: 25,
    marginTop: 25,
    position: "absolute",
    alignSelf: "flex-end"
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 130,
    backgroundColor: '#00BFA6',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    color: '#8C8C8C',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 20,
    borderBottomWidth: 3,
    borderColor: '#E0E0E0',
  },
  pressable1: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  view5: {
    paddingTop: 20,
    alignItems: "center",
  },
  text4: {
    fontSize: 20,
    fontFamily: "NunitoLight",
  },

});

import { StatusBar } from 'expo-status-bar';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome6 } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

export default function Signup() { 
  const [getImage, setImage] = useState(null);
  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState(""); 
  const [getLastName, setLastName] = useState(""); 
  const [getPassword, setPassword] = useState("");

  const [loaded, error] = useFonts({
    "NunitoLight": require("../assets/fonts/Nunito-Light.ttf"),
    "NunitoSemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.view1}>
      <StatusBar hidden={true} />

      <ScrollView>
        <View>
          <View style={styles.view6}>
            <Pressable onPress={() => router.push("/")}>
              <FontAwesome6 name={"chevron-left"} size={40} color={"#4A90E2"} />
            </Pressable>
            <View style={styles.view7}>
              <Text style={styles.text2}>Complete Profile</Text>
            </View>
          </View>

          <View style={styles.view4}>
            <Pressable
              onPress={async () => {
                let result = await ImagePicker.launchImageLibraryAsync({});
                if (!result.canceled) {
                  setImage(result.assets[0].uri); // Setting the selected image URI
                }
              }}
              style={styles.pressable2}
            >
              {getImage ? ( // Conditionally render the Image component if an image is selected
                <Image source={{ uri: getImage }} style={styles.image1} />
              ) : (
                <FontAwesome6 name="camera" size={20} color="white" />
              )}
            </Pressable>
            <Text style={styles.text1}>Upload Your Profile Picture</Text>
          </View>

        </View>

        <View style={styles.view3}>
          <Text style={styles.text3}>First Name</Text>
          <TextInput
            style={styles.input1}
            inputMode={"text"}
            maxLength={20}
            onChangeText={(text) => setFirstName(text)}
          />

          <Text style={styles.text3}>Last Name</Text>
          <TextInput
            style={styles.input1}
            inputMode={"text"}
            maxLength={20}
            onChangeText={(text) => setLastName(text)}
          />

          <Text style={styles.text3}>Mobile</Text>
          <TextInput
            style={styles.input1}
            inputMode={"tel"}
            maxLength={10}
            placeholder="07xxxxxxxx"
            onChangeText={(text) => setMobile(text)}
          />

          <Text style={styles.text3}>Password</Text>
          <TextInput
            style={styles.input1}
            placeholder="xxxxxxxx"
            secureTextEntry={true}
            maxLength={20}
            onChangeText={(text) => setPassword(text)}
          />

          <View style={styles.view5}>
            <Pressable
              style={styles.pressable1}
              onPress={async () => {

                if (getImage === null) {
                  Alert.alert("Error", "Please upload your profile picture.");
                  return; 
                }

                let formdata = new FormData();
                formdata.append("mobile", getMobile);
                formdata.append("firstName", getFirstName);
                formdata.append("lastName", getLastName);
                formdata.append("password", getPassword);

                if (getImage != null) {
                  formdata.append("image", {
                    name: "avatar.png", 
                    type: "image/png",
                    uri: getImage,
                  });
                }

                let response = await fetch("http://192.168.8.137:8080/VibeTalk/SignUp", {
                  method: "POST",
                  body: formdata,
                });

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    router.replace({
                      pathname: "/signin",
                      params: { mobile: getMobile }
                    });
                  } else {
                    Alert.alert("Error", json.message);
                  }
                } else {
                  Alert.alert("Error", "Server error.");
                }
              }}
            >
              <Text style={styles.text4}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 20,
  },
  view3: {
    flex: 1,
    rowGap: 10,
    paddingTop: 20,
  },
  text1: {
    fontSize: 20,
    fontFamily: "NunitoSemiBold",
    textAlign: "center",
  },
  text2: {
    fontSize: 30,
    fontFamily: "NunitoSemiBold",
    textAlign: "center",
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
  view4: {
    flex: 4,
    paddingTop: 40,
    alignItems: "center",
  },
  view6: {
    flex: 2,
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  view7: {
    flex: 4,
  },
  input1: {
    width: "100%",
    height: 50,
    borderStyle: "solid",
    borderRadius: 15,
    borderWidth: 2,
    paddingStart: 10,
    fontSize: 18,
    fontFamily: "NunitoSemiBold",
    borderColor: "#384B70",
  },
  pressable1: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
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
  image1: {
    width: 80,
    height: 80,
    borderRadius: 80,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

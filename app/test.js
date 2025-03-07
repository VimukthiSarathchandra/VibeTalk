import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet, Text, Pressable, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();
export default function home() {
  const [getChatArray, setChatArray] = useState([]);

 

  useEffect(() => {
    async function fetchData() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);

      let response = await fetch(
        "http://192.168.8.100:8080/SmartChat1/LoadHomeData?id=1"
      );

      if (response.ok) {
        let json = await response.json();
        if (json.success) {
          let chatArray = json.jsonChatArray;
          //console.log(chatArray);
          setChatArray(chatArray);
        }
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <LinearGradient colors={["#83a4d4", "#b6fbff"]} style={stylesheet.view1}>
      <StatusBar hidden={true} />
      <FlashList
        data={getChatArray}
        renderItem={({ item }) => (
          <Pressable style={stylesheet.view5} onPress={
            () => {
               // Alert.alert("View Chat","User:"+item.other_user_id);
                router.push(
                  {
                    pathname:"/chat",
                    params:item
                  }
                );
            }
          }>
            <View
              style={
                item.other_user_status == 1
                  ? stylesheet.view6_2
                  : stylesheet.view6_1
              }
            >
              {item.avatar_image_found ? (
                <Image source={("http://192.168.8.100:8080/SmartChat1/AvaterImages/"+item.other_user_mobile+".png")}
                contentFit="contain"
                style={stylesheet.image1}
                />
                
              ) : (
                <Text style={stylesheet.text6}>{item.other_user_avatar_letters}</Text>
              )}
            </View>
            <View style={stylesheet.view4}>
              <Text style={stylesheet.Text1}>{item.other_user_name}</Text>
              <Text style={stylesheet.Text4} numberOfLines={1}>
                {item.message}
              </Text>
              <View style={stylesheet.view7}>
                <Text style={stylesheet.Text5}>{item.dateTime}</Text>
                <FontAwesome6
                  name={"check"}
                  color={item.chat_status_id == 1 ? "green" : "white"}
                  size={20}
                />
              </View>
            </View>
          </Pressable>
        )}
        estimatedItemSize={200}
      />
    </LinearGradient>
  );
}

const stylesheet = StyleSheet.create({
  view1: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 25,
  },

  view4: {
    flex: 1,
  },

  Text1: {
    // fontFamily: "Montserrat-Bold",
    fontSize: 22,
  },

  Text2: {
    // fontFamily: "Montserrat-Regular",
    fontSize: 18,
  },

  Text3: {
    // fontFamily: "Montserrat-Regular",
    fontSize: 14,
    alignSelf: "flex-end",
  },

  view5: {
    flexDirection: "row",
    marginVertical: 10,
    columnGap: 20,
  },

  view6_1: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    borderStyle: "dotted",
    borderWidth: 4,
    borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },

  view6_2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    borderStyle: "dotted",
    borderWidth: 4,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },

  Text4: {
    // fontFamily: "Montserrat-Regular",
    fontSize: 20,
  },

  Text5: {
    // fontFamily: "Montserrat-Regular",
    fontSize: 14,
  },

  scrollView1: {
    marginTop: 10,
  },

  view7: {
    flexDirection: "row",
    columnGap: 10,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text6: {
    // fontFamily: "Montserrat-Bold",
    fontSize: 40,
  },
  image1: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignSelf: "center",
  },
});
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function Home() {

  const [getChatArray, setChatArray] = useState([]);
  const [user, setUser] = useState({ mobile: '' });

  const [loaded, error] = useFonts({
    "NunitoLight": require("../assets/fonts/Nunito-Light.ttf"),
    "NunitoSemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }

        if (user?.id) {
          const response = await fetch("http://192.168.8.137:8080/VibeTalk/LoadHomeData?id=" + user.id);
          if (response.ok) {
            const json = await response.json();
            if (json.success) {
              setChatArray(json.jsonChatArray);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
  }, [user.id]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.viwe1}>
      <StatusBar hidden={true} />

      <View style={styles.view2}>
        <Text style={styles.text1}>VibeTalk</Text>
        <Pressable style={styles.pressable1} onPress={() => router.push("/profile")}>
          <Image
            style={styles.profilePic}
            source={{ uri: `http://192.168.8.137:8080/VibeTalk/Images/${user.mobile}.png` }}
          />
        </Pressable>
      </View>

      <View style={styles.view3}>
        <FlashList
          data={getChatArray}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push({ pathname: "/chat", params: item })}
            >
              <View style={styles.chatItem}>
                <Image
                  style={styles.chatImage}
                  source={{ uri: `http://192.168.8.137:8080/VibeTalk/Images/${item.other_user_mobile}.png` }}
                  borderColor={item.other_user_status == 2 ? "white" : "green"}
                />
                <View style={styles.chatDetails}>
                  <Text style={styles.chatName}>{item.other_user_name}</Text>
                  <Text style={styles.chatMessage}>{item.message}</Text>
                </View>
                <Text style={styles.chatTime}>{item.dateTime}</Text>
              </View>
            </Pressable>
          )}
          estimatedItemSize={200}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viwe1: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F0F4FF',
  },
  view2: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#376591",
    paddingHorizontal: 20,
    flexDirection: "row",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: '#E0E0E0',
    marginTop: 10,
  },
  view3: {
    flex: 10,
    rowGap: 10,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  text1: {
    fontSize: 30,
    fontFamily: "NunitoSemiBold",
    color: "white",
  },
  pressable1: {
    backgroundColor: "#e0dcdb",
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    borderBottomWidth: 3,
    borderBottomColor: '#E0E0E0',
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#d9dfff',
    borderWidth: 2,
    textAlignVertical: "center",
    textAlign: "center",
  },
  chatDetails: {
    flex: 1,
    marginLeft: 10,
  },
  chatName: {
    fontFamily: "NunitoSemiBold",
    fontSize: 15,
  },
  chatMessage: {
    color: 'gray',
    fontFamily: "NunitoLight",
  },
  chatTime: {
    fontSize: 12,
    color: 'gray',
  },
});

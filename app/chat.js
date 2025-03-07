import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Pressable, Alert } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome6 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function chat() {

  //get parameters
  const item = useLocalSearchParams();

  //store chat array
  const [getChatArray, setChatArray] = useState([]);
  const [getChatText, setChatText] = useState("");

  //fetch chat array from server
  useEffect(() => {
    async function fetchChatArray() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);

      let response = await fetch(
        "http://192.168.8.137:8080/VibeTalk/LoadChat?logged_user_id=" +
        user.id +
        "&other_user_id=" +
        item.other_user_id
      );
      if (response.ok) {
        let chatArray = await response.json();
        //console.log(chatArray);
        setChatArray(chatArray);
      }
    }
    fetchChatArray();
    setInterval(() => {
      fetchChatArray();
    }, 5000);
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}
    >
      <StatusBar hidden={true} />

      <View style={styles.header}>

        <View style={styles.headerLeft}>

          <Pressable onPress={
            () => {
              router.push("/signin");
            }
          }>
            <FontAwesome6 name={"chevron-left"} size={25} color={"#376591"} />
          </Pressable>

          <View style={styles.headerLeft}>

            <Pressable onPress={() => router.push({ pathname: "/otheruserprofile", params: item })}>
              <Image source={{ uri: "http://192.168.8.137:8080/VibeTalk/Images/" + item.other_user_mobile + ".png" }} style={styles.avatar} />
            </Pressable>
            <Text style={styles.headerTitle}>{item.other_user_name}</Text>

          </View>

        </View>

      </View>

      {/* Message List */}
      <FlashList
        data={getChatArray}
        renderItem={({ item }) => (

          <View style={[styles.messageContainer, item.side == "right" ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.text4}>{item.datetime}</Text>
            {item.side == "right" ? (
              <FontAwesome6
                name={"check"}
                color={item.status == 1 ? "green" : "white"}
                size={10}
              />
            ) : null}
          </View>
        )}
        estimatedItemSize={200}
      />

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TouchableOpacity>
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={getChatText}
          onChangeText={(text) => {
            setChatText(text);
          }}
        />
        <Pressable onPress={async () => {
            if (getChatText.length == 0) {
              Alert.alert("Error", "Please enter your message.");
            } else {
              try {
                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                // Construct URL correctly
                let response = await fetch(
                  `http://192.168.8.137:8080/VibeTalk/SendChat?logged_user_id=${
                    user.id
                  }&other_user_id=${
                    item.other_user_id
                  }&message=${encodeURIComponent(getChatText)}`
                );

                if (response.ok) {
                  let json = await response.json();

                  if (json.success) {
                    console.log("Message Sent");
                    setChatText(""); // Clear the input after sending
                  } else {
                    Alert.alert("Error", "Failed to send message.");
                  }
                } else {
                  Alert.alert("Error", "Server responded with an error.");
                }
              } catch (error) {
                // Handle fetch errors
                Alert.alert(
                  "Error",
                  "Failed to send message. Please check your network."
                );
                console.error(error);
              }
            }
          }}
        
        >
          <Text style={styles.sendButton}><FontAwesome6 name={"paper-plane"} size={25} color={"#376591"} /></Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F0F4FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    padding: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#a1b7f0',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
  },
  messageText: {
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F0F4FF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  plusIcon: {
    fontSize: 24,
    color: '#4A90E2',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
  },
  sendButton: {
    fontSize: 16,
    color: '#4A90E2',
    paddingHorizontal: 10,
  },
  view6: {
    flexDirection: "row",
    columnGap: 10,
  },
});

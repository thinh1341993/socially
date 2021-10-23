import { useLayoutEffect, useState, useEffect } from "react";
import {
  TouchableOpacity,
  FlatList,
  StatusBar,
  Dimensions,
  Text,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { AntDesign, Ionicons, Fontisto } from "@expo/vector-icons";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { Keyboard } from "react-native";
import { MenuItem } from "react-native-material-menu";
import React from "react";
import moment from "moment";
import * as firebase from "firebase";
import Menu from "react-native-material-menu";
import { ColorPicker } from "react-native-color-picker";

const windowWidth = Dimensions.get("window").width;

const ChatScreen = ({ navigation, route }) => {
  const lastSeen = "Last seen unknown"; //Last seen is not functional yet.
  const user = useSelector(selectUser);
  const [chats, setChats] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [chatDetails, setChatDetails] = useState(route.params.item);
  const [friend, setFriend] = useState("");
  const [backgroundModalVisible, setBackgroundModalVisible] = useState(false);
  const [chatBackground, setChatBackground] = useState("black");

  var menu = null;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    db.collection("users")
      .doc(route.params.item.friend)
      .get()
      .then((snapshot) => {
        setFriend(snapshot.data());
      });
  }, [navigation]);

  useEffect(() => {
    const unsubscibe = db
      .collection("chats")
      .doc(chatDetails.id)
      .collection("data")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setChats(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
    return unsubscibe;
  }, [chats, chatDetails]);

  const blockCheck = () => {
    if (blockedBy == "") {
      return false;
    } else {
      return true;
    }
  };

  const sendMessage = (image) => {
    let img;
    img = typeof image === "string" ? image : "";
    Keyboard.dismiss();
    db.collection("chats").doc(chatDetails.id).collection("data").add({
      message: input,
      sender: user.uid,
      receiver: route.params.item.friend,
      image: img,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    db.collection("chats").doc(chatDetails.id).update({
      preview: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };

  const showMenu = () => {
    console.log("sdfsdf", menu.show());
    menu.show();
  };

  const hideMenu = () => {
    menu.hide();
  };

  const setMenuRef = (ref) => {
    menu = ref;
  };

  const block = () => {
    hideMenu();
    if (chatDetails.blockedBy == user.uid) {
      db.collection("chats")
        .doc(chatDetails.id)
        .set({
          blockedBy: "",
        })
        .then(() => {
          let tempObject = chatDetails;
          tempObject["blockedBy"] = "";
          setChatDetails(tempObject);
        });
    } else {
      if (chatDetails.blockedBy == "") {
        db.collection("chats")
          .doc(chatDetails.id)
          .set({
            blockedBy: user.uid,
          })
          .then(() => {
            let tempObject = chatDetails;
            tempObject["blockedBy"] = user.uid;
            setChatDetails(tempObject);
          });
      }
    }
  };

  const privateNote = () => {
    menu.hide();
    navigation.navigate("PvtChat", { id: user.uid, rid: friend.uid });
  };

  const changeColor = () => {
    menu.hide();
    setBackgroundModalVisible(true);

    // db.collection("chats")
    //   .doc(chatDetails.id)
    //   .update({
    //     color: !chatDetails.color,
    //   })
    //   .then(() => {
    //     let tempObject = chatDetails;
    //     tempObject["color"] = !chatDetails.color;
    //     setChatDetails(tempObject);
    //   });
  };

  const backgroundChangeColor = (color) => {
    setChatBackground(color);
    setBackgroundModalVisible(false);
  };

  if (loading) {
    return (
      <View
        style={{
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#3240FF" size="large" />
      </View>
    );
  }

  return (
    <View backgroundColor={chatBackground} flex={1}>
      <StatusBar
        barStyle={chatDetails ? "light-content" : "dark-content"}
        backgroundColor={chatDetails ? "#000000" : "#FFFFFF"}
      />
      <View
        style={{
          height: 60,
          width: windowWidth,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 30,
          borderBottomWidth: 0.5,
          borderBottomColor: "#C7C6CE",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 10 }}
        >
          <Ionicons
            name={"chevron-back-outline"}
            size={35}
            color={chatDetails ? "#FFFFFF" : "#000000"}
          />
        </TouchableOpacity>
        <Image
          style={{
            resizeMode: "cover",
            marginLeft: 20,
            height: 40,
            width: 40,
            borderTopLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: "#F5F5F5",
          }}
          source={
            friend?.photoURL != null
              ? { uri: friend.photoURL }
              : require("../../assets/user-blue.png")
          }
        />
        <View style={{ width: windowWidth - 100 }}>
          <Text
            style={{
              color: chatDetails ? "#FFFFFF" : "#000000",
              fontSize: 16,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            {friend.displayName}
          </Text>
          <Text
            style={{
              color: "#A3A3AD",
              fontWeight: "bold",
              fontSize: 16,
              marginLeft: 10,
            }}
          >
            {lastSeen}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => showMenu()}
          style={{ position: "absolute", right: 70 }}
        >
          <AntDesign name={"setting"} size={25} color={"#C7C6CE"} />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: "absolute", right: 30 }}>
          <AntDesign name={"search1"} size={25} color={"#C7C6CE"} />
        </TouchableOpacity>
      </View>

      <Menu
        style={{
          backgroundColor: chatDetails ? "#FFFFFF" : "#000000",
          color: chatDetails ? "#FFFFFF" : "#000000",
        }}
        ref={setMenuRef}
      >
        <MenuItem onPress={block}>
          {" "}
          {chatDetails.blockedBy == "" ? "Block User" : "Unblock"}
        </MenuItem>
        <MenuItem onPress={privateNote}> Private Note</MenuItem>
        <MenuItem onPress={changeColor}>
          {" "}
          {/* {chatDetails.color ? "Light Mode" : "Dark Mode"} */}
          Background Color
        </MenuItem>
      </Menu>

      <FlatList
        data={chats}
        style={{ marginBottom: 90, marginTop: -30 }}
        contentContainerStyle={{ paddingBottom: 5, paddingTop: 15 }}
        keyExtractor={({ id }) => id}
        renderItem={({ item, index }) => (
          <View>
            {(() => {
              if (item.data.sender == user.uid) {
                if (index - 1 >= 0) {
                  if (index + 1 <= chats.length - 1) {
                    if (chats[index + 1].data.sender != item.data.sender) {
                      return (
                        <View
                          style={{
                            marginLeft: 120,
                            marginRight: 20,
                            marginBottom: 10,
                            flexDirection: "row",
                            alignSelf: "flex-end",
                            alignItems: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              backgroundColor: "#3240FF",
                              alignSelf: "flex-end",
                              padding: 10,
                              borderRadius: 10,
                              color: "#FFFFFF",
                              borderBottomRightRadius: 0,
                            }}
                          >
                            {item.data.message}
                          </Text>
                          <Image
                            style={{
                              resizeMode: "cover",
                              marginLeft: 11,
                              height: 39,
                              width: 39,
                              borderTopLeftRadius: 10,
                              borderBottomRightRadius: 10,
                              borderTopRightRadius: 10,
                              backgroundColor: "#3240FF",
                            }}
                            source={
                              user.photoURL != null
                                ? { uri: user.photoURL }
                                : require("../../assets/user.png")
                            }
                          />
                        </View>
                      );
                    }
                  } else {
                    return (
                      <View
                        style={{
                          marginLeft: 120,
                          marginRight: 20,
                          marginBottom: 10,
                          flexDirection: "row",
                          alignSelf: "flex-end",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            backgroundColor: "#3240FF",
                            alignSelf: "flex-end",
                            padding: 10,
                            borderRadius: 10,
                            color: "#FFFFFF",
                            borderBottomRightRadius: 0,
                          }}
                        >
                          {item.data.message}
                        </Text>
                        <Image
                          style={{
                            resizeMode: "cover",
                            marginLeft: 11,
                            height: 39,
                            width: 39,
                            borderTopLeftRadius: 10,
                            borderBottomRightRadius: 10,
                            borderTopRightRadius: 10,
                            backgroundColor: "#3240FF",
                          }}
                          source={
                            user.photoURL != null
                              ? { uri: user.photoURL }
                              : require("../../assets/user.png")
                          }
                        />
                      </View>
                    );
                  }
                }

                return (
                  <View
                    style={{
                      marginLeft: 70,
                      marginRight: 70,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: "#3240FF",
                        alignSelf: "flex-end",
                        padding: 10,
                        borderRadius: 10,
                        color: "#FFFFFF",
                      }}
                    >
                      {item.data.message}
                    </Text>
                  </View>
                );
              } else {
                if (index - 1 >= 0) {
                  if (index + 1 <= chats.length - 1) {
                    if (chats[index + 1].data.sender != item.data.sender) {
                      return (
                        <View
                          style={{
                            marginLeft: 20,
                            marginRight: 120,
                            marginBottom: 10,
                            flexDirection: "row",
                            alignSelf: "flex-start",
                            alignItems: "flex-end",
                          }}
                        >
                          <Image
                            style={{
                              resizeMode: "cover",
                              marginBottom: 29,
                              marginRight: 11,
                              height: 39,
                              width: 39,
                              borderRadius: 10,
                              borderBottomRightRadius: 0,
                              backgroundColor: "#F5F5F5",
                            }}
                            source={
                              friend?.photoURL != null
                                ? { uri: friend.photoURL }
                                : require("../../assets/user-blue.png")
                            }
                          />
                          <View>
                            <Text
                              style={{
                                backgroundColor: "#F5F5F5",
                                alignSelf: "flex-start",
                                padding: 10,
                                borderRadius: 10,
                                color: "#000000",
                                borderBottomLeftRadius: 0,
                              }}
                            >
                              {item.data.message}
                            </Text>
                            <Text
                              style={{
                                alignSelf: "flex-end",
                                color: "#C7C6CE",
                                padding: 5,
                              }}
                            >
                              {moment(
                                new Date(
                                  item.data.timestamp.seconds * 1000
                                ).toUTCString()
                              ).fromNow()}
                            </Text>
                          </View>
                        </View>
                      );
                    }
                  } else {
                    return (
                      <View
                        style={{
                          marginLeft: 20,
                          marginRight: 120,
                          marginBottom: 10,
                          flexDirection: "row",
                          alignSelf: "flex-start",
                          alignItems: "flex-end",
                        }}
                      >
                        <Image
                          style={{
                            resizeMode: "cover",
                            marginBottom: 29,
                            marginRight: 11,
                            height: 39,
                            width: 39,
                            borderRadius: 10,
                            borderBottomRightRadius: 0,
                            backgroundColor: "#F5F5F5",
                          }}
                          source={
                            friend?.photoURL != null
                              ? { uri: friend.photoURL }
                              : require("../../assets/user-blue.png")
                          }
                        />
                        <View>
                          <Text
                            style={{
                              backgroundColor: "#F5F5F5",
                              alignSelf: "flex-start",
                              padding: 10,
                              borderRadius: 10,
                              color: "#000000",
                              borderBottomLeftRadius: 0,
                            }}
                          >
                            {item.data.message}
                          </Text>
                          <Text
                            style={{
                              alignSelf: "flex-end",
                              color: "#C7C6CE",
                              padding: 5,
                            }}
                          >
                            {moment(
                              new Date(
                                item.data.timestamp.seconds * 1000
                              ).toUTCString()
                            ).fromNow()}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                }

                return (
                  <View
                    style={{
                      marginLeft: 70,
                      marginRight: 70,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: "#F5F5F5",
                        alignSelf: "flex-start",
                        padding: 10,
                        borderRadius: 10,
                        color: "#000000",
                      }}
                    >
                      {item.data.message}
                    </Text>
                  </View>
                );
              }
            })()}
          </View>
        )}
      />

      {chatDetails?.blockedBy === user?.uid ? (
        <View
          style={{
            width: "100%",
            borderTopWidth: 0.5,
            borderTopColor: "#C7C6CE",
            paddingTop: 10,
            justifyContent: "center",
            backgroundColor: chatBackground,
            position: "absolute",
            bottom: 0,
            height: 90,
            width: windowWidth,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>
            This user has been blocked by you.
          </Text>
        </View>
      ) : chatDetails?.blockedBy === friend?.uid ? (
        <View
          style={{
            width: "100%",
            borderTopWidth: 0.5,
            borderTopColor: "#C7C6CE",
            paddingTop: 10,
            justifyContent: "center",
            backgroundColor: chatBackground,
            position: "absolute",
            bottom: 0,
            height: 90,
            width: windowWidth,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>
            You have been blocked by this user.
          </Text>
        </View>
      ) : (
        <>
          <View
            style={{
              backgroundColor: chatBackground,
              position: "absolute",
              bottom: 0,
              flexDirection: "row",
              height: 90,
              width: windowWidth,
              alignItems: "center",
              borderTopWidth: 0.5,
              borderTopColor: "#C7C6CE",
            }}
          >
            <View style={{ width: windowWidth - 80, marginRight: 10 }}>
              <TextInput
                editable={false}
                style={{
                  marginLeft: 20,
                  fontSize: 18,
                  marginBottom: 10,
                  color: chatDetails ? "#FFFFFF" : "#000000",
                }}
              />
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={{ marginLeft: 20 }}>
                  <AntDesign name={"pluscircle"} size={30} color={"#2EDDB8"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 10 }}>
                  <Fontisto name={"smiley"} size={30} color={"#C7C6CE"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 10 }}>
                  <AntDesign name={"picture"} size={30} color={"#C7C6CE"} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              disabled={blockCheck}
              onPress={sendMessage}
              style={{
                backgroundColor: "#D2FFF4",
                width: 50,
                height: 50,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={"ios-send-outline"} size={30} color={"#2EDDB8"} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={{
              position: "absolute",
              bottom: 0,
              marginLeft: 20,
              fontSize: 18,
              marginBottom: 51,
              color: chatDetails ? "#FFFFFF" : "#000000",
            }}
            placeholder={"Type a message..."}
            placeholderTextColor={chatDetails ? "#A3A3AD" : "#C7C7CD"}
            onChangeText={setInput}
            value={input}
          />
        </>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={backgroundModalVisible}
        style={{ flexDirection: "column" }}
        onRequestClose={() => {
          setBackgroundModalVisible(!backgroundModalVisible);
        }}
      >
        <ColorPicker
          onColorSelected={(color) => backgroundChangeColor(color)}
          style={{ flex: 1, backgroundColor: "white" }}
        />
      </Modal>
    </View>
  );
};

export default ChatScreen;
/*
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Platform } from 'react-native';
import { Keyboard } from 'react-native';
import * as firebase from 'firebase';
import EmojiSelector, { Categories } from 'react-native-emoji-selector'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, Image, Modal } from 'react-native';
import { fetchGifs, fetchSearch } from '../../gifs';
import AvatarCarousel from '../../components/AvatarCarousel';
import { useSelector } from 'react-redux';
import { selectChatUser } from '../../redux/features/chatUser';
import { db } from '../../firebase';
import { selectUser } from '../../redux/features/userSlice';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { ColorPicker } from 'react-native-color-picker';
import { Foundation } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';
import Menu, { MenuItem } from 'react-native-material-menu';


const ChatScreen = ({ route }) => {
	const navigation = useNavigation();
	const [input, setInput] = useState('');
	const [emoji, setEmoji] = useState(false);
	const [gifs, setGifs] = useState([]);
	const [term, updateTerm] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [backgroundModalVisible, setBackgroundModalVisible] = useState(false)
	const chatUser = useSelector(selectChatUser) || route?.params?.friend;
	const user = useSelector(selectUser);
	const [messageFriend, setMessageFriend] = useState(null);
	const [senderId, setSenderId] = useState(null);
	const [chats, setChats] = useState([])
	const [chatDetails, setChatDetails] = useState({})
	const friend = route?.params?.friend;
	const [chatBackground, setChatBackground] = useState('white');
	const [loading, setLoading] = useState(true)
	const imageInitialMesage = route?.params?.image

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerRightContainerStyle: { marginRight: 10 },
			headerRight: () => (
				<Menu
					ref={setMenuRef}
					button={<Foundation onPress={() => showMenu()} name="background-color" size={29} color="black" />} >
					<MenuItem onPress={block}>{chatDetails?.blockedBy === user?.uid ? "Unblock User" : "Block User"}</MenuItem>
					<MenuItem onPress={privateNote}>Private Note</MenuItem>
					<MenuItem onPress={changeBackgrounColor}>Background Color</MenuItem>
				</Menu>
				// <TouchableOpacity onPress={() => setBackgroundModalVisible(true)}>
				// 	<Foundation name="background-color" size={29} color="black" />
				// </TouchableOpacity>
			),
			headerTitle: chatUser?.displayName || friend?.displayName || 'user',
		})
	}, [chatUser, navigation, chatDetails, loading])


	// useEffect(() => {
	// 	db.collection("users").where("email", "==", chatUser?.email || friend?.email).get().then((snapshot) => {
	// 		snapshot.docs.map((doc) => {
	// 			setMessageFriend(doc.id);
	// 		})
	// 	}).catch((error) => {
	// 		console.log("Error getting documents: ", error);
	// 	});
	// }, [chatUser]);


	// useEffect(() => {
	// 	if (messageFriend) {
	// 		db.collection("users").doc(messageFriend).collection("friends").where("email", "==", user?.email).get().then((snapshot) => {
	// 			snapshot.docs.map((doc) => {
	// 				setSenderId(doc.id)
	// 			})
	// 		})
	// 	}
	// }, [messageFriend]);
	// useEffect(() => {
	// 	if (imageInitialMesage) {
	// 		db.collection("messages").doc(`${user?.uid}-${friend?.uid}`).collection('data').add({
	// 			message: "",
	// 			sender: user?.uid,
	// 			reciever: friend?.uid,
	// 			image: imageInitialMesage,
	// 			timestamp: firebase.firestore.FieldValue.serverTimestamp()
	// 		})
	// 	}

	// }, [imageInitialMesage])

	useEffect(() => {
		const unsubscibe = db.collection("messages").doc(`${user?.uid}-${friend?.uid}`).collection("data").orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
			setChats(snapshot.docs.map((doc) => ({
				id: doc.id,
				data: doc.data()
			})))
		})
		return unsubscibe;
	}, [chatUser]);


	const sendMessage = (image) => {
		let img;
		img = typeof image === "string" ? image : ''
		Keyboard.dismiss();
		db.collection("messages").doc(`${user?.uid}-${friend?.uid}`).collection('data').add({
			message: input,
			sender: user?.uid,
			reciever: friend?.uid,
			image: img,
			timestamp: firebase.firestore.FieldValue.serverTimestamp()
		})

		setInput("");

	}

	useEffect(() => {
		if (!term)
			fetchGifs(setGifs);
	}, [])

	useEffect(() => {
		const subscriber = db.collection("messages").doc(`${user?.uid}-${friend?.uid}`)
			.onSnapshot(documentSnapshot => {
				setChatDetails(documentSnapshot.data());
				setLoading(false)
			});

		// Stop listening for updates when no longer required
		return () => subscriber();
	}, [user, friend]);

	const onEdit = (newTerm) => {
		updateTerm(newTerm);
		fetchSearch(setGifs);
	}
	const scrollView = useRef();

	const backgroundChangeColor = (color) => {
		setChatBackground(color);
		setBackgroundModalVisible(false);
	}

	const changeBackgrounColor = () => {
		menu.hide()
		setBackgroundModalVisible(true)
	}

	const privateNote = () => {
		menu.hide()
		navigation.navigate('PvtChat', { id: user?.uid, rid: friend?.uid })
	}

	const block = () => {
		hideMenu();
		if (chatDetails?.blockedBy === user?.uid) {
			db.collection("messages").doc(`${user?.uid}-${friend?.uid}`)
				.set({
					blockedBy: ''
				}).then(() => {
					setChatDetails({ blockedBy: '' })
				})
			return;
		}
		db.collection("messages").doc(`${user?.uid}-${friend?.uid}`)
			.set({
				blockedBy: user?.uid
			}).then(() => {
				setChatDetails({ blockedBy: user?.uid })
			})
	}


	var menu = null;

	const setMenuRef = ref => {
		menu = ref;
	}

	const hideMenu = () => {
		menu.hide();
	}

	const showMenu = () => {
		menu.show();
	}

	if (loading) {
		return (
			<View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator color='blue' size='small' />
			</View>
		)
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: chatBackground }}>
			<StatusBar style="dark" />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.container}
				keyboardVerticalOffset={90}
			>
				<View style={styles.header}>
					<AvatarCarousel currentIndex={friend?.id} uid={friend?.uid} />
				</View>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<>
						<ScrollView
							ref={scrollView}
							onContentSizeChange={() => scrollView.current.scrollToEnd({ animated: true })}
							contentContainerStyle={{
								paddingTop: 15
							}}
						>
							{chats.map(({ id, data }) => (
								data.sender === user?.uid ? (
									<View key={id} style={styles.commentContainer}>
										<View style={styles.sender}>
											<View style={styles.content}>
												<View style={[styles.col, { backgroundColor: "#8E2DE2", }]}>
													{data?.image ? <Image source={{ uri: data?.image }} style={styles.image} /> : null}
													<Text style={styles.senderText}>{data.message}</Text>
												</View>
											</View>
										</View>
										<Text style={styles.senderTimestamp}>{moment(new Date(data?.timestamp?.seconds * 1000).toUTCString()).fromNow()}</Text>
									</View>
								) : (
									<View key={id} style={styles.commentContainer}>
										<View style={styles.reciever}>
											<Avatar
												size={40}
												rounded
												source={{
													uri: friend?.photoURL
												}}
												containerStyle={{
													marginRight: 5
												}}
											/>
											<View style={styles.content}>
												<View style={[styles.col, { backgroundColor: "lightgray" }]}>
													{data?.image ? <Image source={{ uri: data?.image }} style={styles.image} /> : null}
													<Text style={styles.recieverText}>{data.message}</Text>
												</View>
											</View>
										</View>
										<Text style={styles.receiverTimestamp}>{moment(new Date(data?.timestamp?.seconds * 1000).toUTCString()).fromNow()}</Text>
									</View>
								)
							))}

						</ScrollView>
						<View style={styles.footer}>
							{
								chatDetails?.blockedBy === user?.uid ?
									<View style={{ width: "100%", borderTopColor: '#c4c4c4', borderTopWidth: 1, paddingTop: 10, justifyContent: "center" }}>
										<Text style={{ textAlign: "center" }}>This user has been blocked by you.</Text>
									</View> : chatDetails?.blockedBy === friend?.uid ? <View style={{ width: "100%", borderTopColor: '#c4c4c4', borderTopWidth: 1, paddingTop: 10, justifyContent: "center" }}>
										<Text style={{ textAlign: "center" }}>You have been blocked by this user.</Text>
									</View> :
										<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', }}>
											<TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }}>
												<MaterialCommunityIcons name="gif" size={30} color="black" />
											</TouchableOpacity>
											<TouchableOpacity onPress={() => { emoji ? setEmoji(false) : setEmoji(true) }}>
												<Text style={styles.emoji}>😄</Text>
											</TouchableOpacity>
											<TextInput
												value={input}
												onSubmitEditing={sendMessage}
												onChangeText={setInput}
												placeholder="Type message here..."
												style={styles.textInput}
											/>
											<TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
												<Ionicons name="send" size={24} color="#2B68E6" />
											</TouchableOpacity>
										</View>
							}
						</View>
					</>
				</TouchableWithoutFeedback>
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					style={{ flexDirection: "column" }}
					onRequestClose={() => {
						setModalVisible(!modalVisible);
					}}
				>
					<View style={styles.top} />
					<View style={styles.gif}>
						<View style={styles.modalHeader}>
							<TouchableOpacity style={{ marginRight: 10 }} onPress={() => { setModalVisible(false) }}>
								<Ionicons name="md-arrow-back" size={24} color="white" />
							</TouchableOpacity>
							<TextInput
								placeholder="Search Giphy"
								placeholderTextColor='#fff'
								style={styles.textInput}
								onChangeText={(text) => onEdit(text)}
							/>
						</View>
						<FlatList
							data={gifs}
							numColumns={2}
							style={{ marginBottom: 40 }}
							renderItem={({ item }) => (
								<TouchableOpacity onPress={() => sendMessage(item.images.original.url)}>
									<Image
										resizeMode='contain'
										style={styles.image}
										source={{ uri: item.images.original.url }}
									/>
								</TouchableOpacity>
							)} />
					</View>
				</Modal>
				<Modal
					animationType="slide"
					transparent={true}
					visible={backgroundModalVisible}
					style={{ flexDirection: "column" }}
					onRequestClose={() => {
						setBackgroundModalVisible(!backgroundModalVisible);
					}}
				>
					<ColorPicker onColorSelected={(color) => backgroundChangeColor(color)} style={{ flex: 1, backgroundColor: "white" }} />
				</Modal>
			</KeyboardAvoidingView>
			{emoji ? <EmojiSelector
				showSearchBar={false}
				showTabs={true}
				showHistory={true}
				showSectionTitles={true}
				category={Categories.all} onEmojiSelected={(emoji) => setInput(emoji)}
			/> : null
			}
		</SafeAreaView>
	)
}

export default ChatScreen;*/

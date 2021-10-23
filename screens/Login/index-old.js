import React, { useEffect, useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'react-native';
import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native';
import { CheckBox, Input, Text, Button } from 'react-native-elements';
import * as firebase from 'firebase';
// import { auth } from '../../firebase';
import { SafeAreaView } from 'react-native';
import { db } from '../../firebase';

const Login = ({ navigation, route }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [checked, setChecked] = useState(false);
	const [username, setUsername] = useState('');
	const isValidPassword = password?.length >= 6 ? true : false;
	const passwordError = !isValidPassword ? " ":"Password length should be atleast 6";

	// console.log('Login direect', route.params.loginDirect);

	const handleCheck = () => {
		setChecked(!checked);
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: false
		})
	}, [navigation])

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
			// console.warn(authUser);
			if (authUser?.email) {
				navigation.reset({
					index: 0,
					routes: [
						{
							name: 'Socially',
							params: { screen: 'Home' },
						},
					],
				})
			}
		});
		return unsubscribe;
	}, []);

	const login = () => {

		/*firebase.auth().createUserWithEmailAndPassword(email.toLowerCase(), password).then(authUser => 
		{
			firebase.authUser().user.updateProfile({ displayName: name, name: name});
			console.log('done');
		})
		.catch(error => 
		{
		});
*/


		firebase.auth().signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Signed in
			var user = userCredential.user;
			const refUser = db.collection('users')
				.doc(user?.uid)
			if (!refUser.exists) {
				db.collection('users').add({
					"displayName": user.displayName,
					"email": user.email,
					"photoURL": user.photoURL,
					"uid": user.uid,
				})
			}

			// console.log('user is signed in -->', user);
			// ...
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorMessage)
		});


return false;











		if (route.params?.loginDirect === true) {
			firebase.auth().signInWithEmailAndPassword(email, password)
				.then((userCredential) => {
					// Signed in
					var user = userCredential.user;
					const refUser = db.collection('users')
						.doc(user?.uid)
					if (!refUser.exists) {
						db.collection('users').add({
							"displayName": user.displayName,
							"email": user.email,
							"photoURL": user.photoURL,
							"uid": user.uid,
						})
					}

					// console.log('user is signed in -->', user);
					// ...
				})
				.catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log(errorMessage)
				});
		} else {

			firebase.auth().currentUser.updateProfile({
				displayName: username || ''
			})
			// firebase.auth().createUserWithEmailAndPassword(email, password).
			// 	then((userCredential) => {
			// 		// Signed in
			// 		var user = userCredential.user;
			// 		const refUser = db.collection('users')
			// 			.doc(user?.uid)
			// 		if (!refUser.exists) {
			// 			db.collection('users').add({
			// 				"displayName": username,
			// 				"email": user.email,
			// 				"photoURL": user.photoURL,
			// 				"uid": user.uid,
			// 			})
			// 		}
			// 	})
			// 	.catch(function (error) {
			// 		var errorCode = error.code;
			// 		var errorMessage = error.message;
			// 	});

			var credential = firebase.auth.EmailAuthProvider.credential(email, password);
			firebase.auth().currentUser
				.linkWithCredential(credential)
				.then(function async(usercred) {
					var user = usercred.user;

					console.log('Account linking success', user);
				})
				.catch(function (error) {
					console.log('Account linking error', error);
				});

			navigation.reset({
				index: 0,
				routes: [
					{
						name: 'Socially',
						params: { screen: 'Home' },
					},
				],
			})
			console.log('login');

		}
	};
	const signup = () => {
        // Sign-out successful.
        console.log("singout successfully");
				navigation.navigate("Authentication");
  };

	const create = () => {
		console.log('create');
	};

	const forgotPassword = () => {
		console.log('forgot');
	};

	return (
	<KeyboardAvoidingView style={styles.container}>
			<SafeAreaView>
				<StatusBar style="auto" />
				<ImageBackground  source={require('../../assets/6.jpg')}
                style={{
                    height:Dimensions.get('window').height/2.5,
										width:Dimensions.get('window').height/2,
                }}>
                <View  style={styles.brandView}>
                <Text style={{fontSize:40, fontWeight:'bold',color:'white'}}>Create better</Text>
                <Text style={{fontSize:40, fontWeight:'bold', color:'white'}}>together.</Text>

                <Text style={{color:'white', marginTop:10}}>Just Our Community</Text>
                </View>
            </ImageBackground>
				<View style={styles.bottombox}>
				<View style={{
                    marginLeft:35,
                    marginTop:25
                }}>
                <Text style={{fontWeight:'bold', fontSize:30}}>Login</Text>
        </View>
				<View style={{margin:20}}>
					<Input
						label="Email"
						inputStyle={{ borderWidth: 1, borderColor: 'gray' }}
						labelStyle={{ marginBottom: 5, fontWeight: '300', color: 'gray' }}
						value={email}
						onChangeText={setEmail}
						inputContainerStyle={{ borderStyle: 'dotted' }}
						autoFocus
						type="email"
						style={styles.input}
						autoCapitalize="none"
					/>
{/*
	{!route.params?.loginDirect ? (
						<Input
							label="Username"
							inputStyle={{ borderWidth: 1, borderColor: 'gray' }}
							labelStyle={{ marginBottom: 5, fontWeight: '300', color: 'gray' }}
							value={username}
							onChangeText={setUsername}
							inputContainerStyle={{ borderStyle: 'dotted' }}
							autoFocus
							type="name"
							style={styles.input}
							autoCapitalize="none"
						/>

					) : null}

*/}
					<Input
						label="Password"
						errorMessage={passwordError}
						inputStyle={{ borderWidth: 1, borderColor: 'gray' }}
						onChangeText={setPassword}
						labelStyle={{ marginBottom: 5, fontWeight: '300', color: 'gray' }}
						secureTextEntry
						type="password"
						style={styles.input}
						autoCapitalize="none"
						inputContainerStyle={{ borderStyle: 'dotted' }}
						onSubmitEditing={login}
					/>

				</View>
				<View style={{alignSelf:'center'}}>
					<View>
						<Button
							buttonStyle={{ borderWidth: 0, width: 280,height:40,borderRadius:10}}
							title="LOG IN"
							onPress={login}
						/>
					</View>

					<View>
						<Button
							style={styles.otherButton}
							type="outline"
							title="LOST PASSWORD ?"
							titleStyle={{ color: 'gray' }}
							buttonStyle={{ borderWidth: 0, width: 250, marginTop:30 }}
							onPress={forgotPassword}
						/>
					</View>
					<View>
						<Button
							style={styles.otherButton}
							type="outline"
							title="Create a New Account. SignUp"
							titleStyle={{ color: 'gray' }}
							buttonStyle={{ borderWidth: 0, width: 250}}
							onPress={signup}
						/>
					</View>
				</View>
				</View>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

export default Login;

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor:'#fff'
	},
	brandView:{
    flex:1,
    justifyContent:'center',
    alignItems:'flex-start',
    marginLeft:30
    },
	bottombox:{
		flex:1,
		bottom:60,
    backgroundColor:'#FFF',
    borderTopStartRadius:20,
    borderTopEndRadius:20
	},
	input: {
		padding: 10
	},
	rememberMe: {
		color: 'black',
		flexDirection: 'row',
		alignItems: 'center',
		width: 300,
		alignSelf: 'center'
	},
	rememberMeText: {},

	otherButton: {
		backgroundColor: 'transparent',
		color: 'white'
	},
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
		width: '100%',
		height: 220,
		margin: 0,
		alignItems: 'center'
	},
});

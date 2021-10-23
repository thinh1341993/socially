import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:"white"
	},
	textInput: {
		marginBottom: 80,
		fontSize: 17,
		fontWeight: 'bold'
	},
	textDetail: {
		fontSize: 15,
		textAlign: 'center',
		padding:80,
		marginTop:90,
		color: "#000000"
	},

	containerAvoidingView: {
		flex: 1,
		alignItems: 'center',
		padding: 10
	},
	textTitle: {
		marginTop: 50,
		fontSize: 15,
		marginBottom: 10,
		textAlign: 'center'
	},
	containerInput: {
		flexDirection: 'row',
		paddingHorizontal: 40,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent:'center'

	},
	openDialogView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	phoneInputStyle: {
		marginLeft: 5,
		flex: 1,
		height: 50,
		borderWidth: 0

	},
	viewBottom: {
		flex: 1,
		justifyContent: 'flex-end',
		marginTop:50,
		alignItems: 'center'
	},
	textTitle: {
		marginTop: 50,
		marginBottom: 50,
		fontSize: 18
	},
	btnContinue: {
		width: 190,
		height: 50,
		// paddingHorizontal: 10,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 0, width: 280,height:40,borderRadius:10
	},
	textContinue: {
		color: '#ffffff',
		alignItems: 'center'
	},
	filterInputStyle: {
		flex: 1,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: '#ffffff',
		color: '#424242'
	},
	countryModalStyle: {
		flex: 1,
		borderColor: 'black',
		borderTopWidth: 1,
		padding: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	modalItemContainer: {
		flex: 1,
		paddingLeft: 5,
		flexDirection: 'row'
	},
	modalItemName: {
		flex: 1,
		fontSize: 16
	},
	modalItemDialCode: {
		fontSize: 16
	},
	filterInputContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	closeButtonStyle: {
		padding: 12,
		alignItems: 'center'
	},
	closeTextStyle: {
		padding: 5,
		fontSize: 20,
		color: 'black',
		fontWeight: 'bold'
	},
	loader: {
		marginTop: 10
	},
	verfied: {
		marginTop: 20
	},
	bottomView: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'flex-end',
		// justifyContent: "flex-end",
		marginBottom: 50,
		alignItems: 'center'
	},
	btnResend: {
		width: 150,
		height: 50,
		borderRadius: 10,
		alignItems: 'flex-end',
		justifyContent: 'center'
	},
	textResend: {
		alignItems: 'center',
		fontSize: 15
	},
	verified: {
		marginTop: 50
	},
	cellView: {
		paddingVertical: 11,
		width: '100%',
		margin: 10,
		fontSize: 16,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1.5
	},
	cellText: {
		textAlign: 'center',
		fontSize: 16
	},
	loginText:{
		color: '#49cbe9',
		fontSize: 16
	},
	signinText:{
		color: '#FFFFFF',
		fontSize: 16,
		marginBottom: 40,
		fontWeight: "bold",
		marginTop: 20
	},
	image:{
		width: 200,
		height: 200,
		// paddingBottom: 20,
		alignSelf: "center",
		marginTop: 50
	}
});

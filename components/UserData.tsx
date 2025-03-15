import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '@/firebaseConfig';
import { collection, getDoc, doc, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// input is data with {"createdAt": "2025-03-15T11:00:42.916Z", "email": "oi@oi.com", "isPsychologist": true, "uid": "MrwwoexWkhQMJJIPWXDGW57UP6O2"}

interface UserDataProps {
	data: any;
}
const UserData: React.FC<UserDataProps> = ({ data }) => {
	const [userData, setUserData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	// console.log(data);
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setUserData(data);
			} catch (error) {
				console.error('Error fetching user data: ', error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [data]);

	if (loading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	if (!userData) {
		return <Text>No user data found</Text>;
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() =>
				addDoc(collection(db, 'connections'), {
					patient: userData.isPsychologist ? getAuth().currentUser?.uid : userData.uid,
					doctor: userData.isPsychologist ? userData.uid : getAuth().currentUser?.uid,
					createdAt: new Date().toISOString(),
				})
			}>
			<Text style={styles.text}>Email: {userData.email}</Text>
			<Text style={styles.text}>Psicologo: {userData.isPsychologist ? 'Sim' : 'Não'}</Text>
			</TouchableOpacity>
			{/* Add more fields as needed */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	text: {
		fontSize: 18,
		marginBottom: 10,
	},
});

export default UserData;
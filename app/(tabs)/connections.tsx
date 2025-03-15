import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '@/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, doc, where, getDoc, query } from 'firebase/firestore';
import UserData from '@/components/UserData';

interface User {
	uid: string;
	email: string;
}

const Connections: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const queryRef = collection(db, 'users');
				const user = getAuth().currentUser;
				if (user) {
					const myUserInfo = doc(db, 'users', user.uid);
					const docSnap = await getDoc(myUserInfo);
					if (docSnap.exists()) {
						const isPsychologist = docSnap.data().isPsychologist;
						const q = query(queryRef, where('isPsychologist', '==', !isPsychologist));
						const querySnapshot = await getDocs(q);
						const usersData: User[] = [];
						querySnapshot.forEach((doc) => {
							usersData.push({
								uid: doc.id,
								email: doc.data().email,
							});
						});
						setUsers(usersData);
					}
				}
			} catch (error) {
				console.error('Error fetching users: ', error);
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	if (loading) {
		return <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />;
	}

	return (
		<FlatList
			data={users}
			keyExtractor={(item) => item.uid}
			renderItem={({ item }) => (
				<TouchableOpacity style={styles.itemContainer}>
					<UserData data={item} />
				</TouchableOpacity>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	loader: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#F7F7F7',
	},
	itemContainer: {
		backgroundColor: '#03DAC6',
		borderRadius: 10,
		padding: 15,
		marginVertical: 8,
		marginHorizontal: 10,
		elevation: 3,
		shadowColor: '#6200EE',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
	titleText: {
		color: '#6200EE',
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		paddingVertical: 10,
	},
});

export default Connections;
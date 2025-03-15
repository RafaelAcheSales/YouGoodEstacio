import { Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { Link, useRouter } from 'expo-router';
import { db } from '@/firebaseConfig';
import { collection, addDoc, getDoc, getDocs, doc, query, where, limit, orderBy } from 'firebase/firestore';
import { Text, View } from '@/components/Themed';

import * as React from 'react';
import Slider from '@react-native-community/slider';
import PatientGraph from '@/components/PatientGraph';

const userSignOut = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log('Sign-out successful.');
  } catch (error: any) {
    console.log('Sign-out failed:', error.message);
  }
};

const onSaveHumor = async (value: any) => {
  const user = getAuth().currentUser;
  if (!user) {
    console.log('No user found');
    return;
  }

  try {
    const date = new Date();
    const docRef = await addDoc(collection(db, 'humor'), {
      uid: user.uid,
      value: value,
      createdAt: date.toISOString(),
    });
    alert(`Humor registrado: ${value} - Hora: ${date.getHours()}:${date.getMinutes()}`);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};

export default function TabOneScreen() {
  const [value, setValue] = React.useState(0);
  const [isPsychologist, setIsPsychologist] = React.useState(false);
  const [patientsData, setPatientsData] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setIsPsychologist(docSnap.data().isPsychologist);

          if (docSnap.data().isPsychologist) {
            const q = query(collection(db, 'connections'), where('doctor', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const newPatientsData = Array<any>();

            querySnapshot.forEach(async (connection) => {
              const humorCollection = collection(db, 'humor');
              const humorSnapshot = await getDocs(query(humorCollection, orderBy('createdAt', 'desc'), limit(7)));
              const humorData = Array();


              humorSnapshot.forEach((humorDoc) => {

                const date = new Date(humorDoc.data().createdAt);
                humorData.push({ value: humorDoc.data().value, timestamp: date.getTime() });
              });

              const patientDoc = doc(db, 'users', connection.data().patient);
              const patientSnap = await getDoc(patientDoc);
              if (patientSnap.exists()) {
                newPatientsData.push({
                  uid: connection.data().patient,
                  email: patientSnap.data().email,
                  humor: humorData,
                });
                setPatientsData([...newPatientsData]);
              }
            });
          }
        }
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.userEmail}>Minha Conta: {getAuth().currentUser?.email}</Text>
      {!isPsychologist ? (
        <>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            minimumTrackTintColor="green"
            maximumTrackTintColor="gray"
            onValueChange={setValue}
          />
          <Text style={styles.humorValue}>Seu Humor: {value}</Text>
          <Button title="Salvar" color="green" onPress={() => onSaveHumor(value)} />
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Pacientes</Text>
          <FlatList
            data={patientsData}
            renderItem={({ item }) => (
              <View style={styles.patientCard}>
                <PatientGraph data={item} />
                <Text style={styles.patientEmail}>{item.email}</Text>
              </View>
            )}
          />
        </>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={userSignOut}>
        <Text style={styles.signOutText}>Sair</Text>
      </TouchableOpacity>

      <Link style={styles.linkParent} href={'/(tabs)/connections'}>
        <Text style={styles.link}>Conexões</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,

  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userEmail: {
    marginBottom: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  slider: {
    width: '90%',
    height: 40,
  },
  humorValue: {
    fontSize: 18,
    marginVertical: 10,
  },
  patientCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  patientEmail: {
    fontWeight: '600',
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#f7f7f7',
    fontWeight: 'bold',
  },
  link: {
    color: '#6200ee',
    marginTop: 10,
    fontWeight: 'bold',
    margin : 10,
  },
  linkParent: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
});
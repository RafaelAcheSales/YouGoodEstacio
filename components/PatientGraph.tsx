import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
interface ReportData {
	uid: string;
	email: string;
	humor: [any];
}

interface Props {
	data: ReportData;
}

const PatientGraph: React.FC<Props> = ({ data }) => {
	const [graphData, setGraphData] = useState<number[]>([1]);
	const [labels, setLabels] = useState<string[]>([]);
	console.log(" PatientGraph data");
	console.log(data);
	useEffect(() => {
		const processData = () => {
			const humorValues: number[] = [];
			const dateLabels: string[] = [];
			console.log("data length", data.humor.length);
			for (let i = 0; i < data.humor.length; i++) {
				console.log("i", i);
				const humor = data.humor;
				console.log("humor", humor);
				console.log(data.email);
				if (humor[i].value) {
					humorValues.push(humor[i].value);
					const date = moment(humor[i].timestamp).format('DD/MM') + ' ' + i
					console.log("date", date);
					dateLabels.push(date);
				}
			}
			
			console.log(humorValues);
			setGraphData(humorValues);
			setLabels(dateLabels);
		};

		processData();
	}, [data]);

	return (
		<View>
			<Text>Humor do paciente recentemente:</Text>
			<LineChart
			data={{
			  labels: labels,
			  datasets: [
				{
				  data: graphData
				}
			  ]
			}}
			width={Dimensions.get("window").width} // from react-native
			height={220}
			segments={10}
			yAxisLabel=""
			yAxisSuffix=""
			yAxisInterval={1} // optional, defaults to 1
			chartConfig={{
			  backgroundColor: "#e26a00",
			  backgroundGradientFrom: "#fb8c00",
			  backgroundGradientTo: "#ffa726",
			  decimalPlaces: 0, // optional, defaults to 2dp
			  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
			  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
			  style: {
				borderRadius: 16
			  },
			  propsForDots: {
				r: "6",
				strokeWidth: "2",
				stroke: "#ffa726"
			  }
			}}
			bezier
			style={{
			  marginVertical: 8,
			  borderRadius: 16
			}}
		  />

		</View>
	);
};

export default PatientGraph;
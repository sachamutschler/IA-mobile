import React, {useState, useEffect} from 'react';
import { Card, Text, IconButton, Modal, Button } from 'react-native-paper';
import { Audio } from 'expo-av';

const TripInfo = ({trip_info}) => {
    return trip_info.map(trip => {
        return (
            <>
                <Text>{trip.city}</Text>
                <Text>Arrivée {trip.arrival_time}</Text>
                <Text>Départ {trip.departure_time}</Text>
                <Text>--------</Text>
            </>
        )
    })
}

const DisplayTrip = ({ trip_data }) => {
    // if(trip_data == undefined){
    //     console.log("c'est undefined")
	//     return <></> 
    // } else {
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: 'white', padding: 20};
    return trip_data.map(trip => {
        return (
            <>
                <Text>Départ {trip.depart} à {trip.depart_departure_time}</Text>
                <Text>Arrivée {trip.destination} à {trip.destination_departure_time}</Text>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}><TripInfo trip_info={trip.trip}></TripInfo></Modal>
                <Button onPress={showModal}>Voir plus d'infos sur ce trajet</Button>
                <Text>-------------------------------------------</Text>
            </>
            
        )
    })
};

export default DisplayTrip;

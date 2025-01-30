import React, {useState, useEffect} from 'react';
import { Card, Text, IconButton } from 'react-native-paper';
import { Audio } from 'expo-av';

const DisplayTrip = ({ trip_data }) => {
    if(trip_data == undefined){
	return <></> 
    } else {
	return trip_data.map(trip => {
	    return <Text>Départ de {trip.depart} et arrivée à {trip.destination}</Text>
	})
    }
    console.log(trip_data[0])

    // useEffect(() => {
    //     console.log('Unloading sound');
    //     return sound ? () => sound.unloadAsync() : undefined;
    // }, [sound]);

    return (
        <>
            {trip_data.forEach(trip => {
                   return ( 
			<Text>
                            <Text>Départ {trip.depart} à {trip.depart_departure_time}</Text>
                            <Text>Arrivée {trip.destination} à {trip.destination_departure_time}</Text>
                    	</Text>
		   )                
            })}
        </>
    );
};

export default DisplayTrip;

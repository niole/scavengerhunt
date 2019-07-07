import React from 'react';
import { View, StyleSheet } from 'react-native';
import TextField from './TextField';

import { LatLng } from '../domain/LatLng';
import MapView, { Marker } from 'react-native-maps';

const defaultStyles = StyleSheet.create({
    map: { margin: 5, height: 400 },
});

const handlePress = (onLocationSelect: Props['onLocationSelect'], setLocation: (loc: LatLng) => void) => (event: any) => {
    const { coordinate } = event.nativeEvent;
    const newLocation: LatLng = [coordinate.latitude, coordinate.longitude];
    setLocation(newLocation);
    onLocationSelect(newLocation)
};

export type SelectedLocationContainerProps = {
    label: string;
    location?: LatLng;
    error?: any;
};

const InputProps = { readOnly: true };

const DefaultContainer = ({ error, label, location }: SelectedLocationContainerProps) => (
    <TextField
        margin="normal"
        InputProps={InputProps}
        error={error ? true : undefined}
        label={label}
        placeholder="Please select a location"
        value={location ?
            `latitude: ${location[0]}, longitude: ${location[1]}` :
            undefined
        }
    />
);

type Props = {
    error?: any;
    SelectedLocationContainer?: (props: SelectedLocationContainerProps) => JSX.Element;
    onLocationSelect: (location: LatLng) => void;
    defaultLocation?: LatLng;
};

const LocationSelector = ({
        SelectedLocationContainer = DefaultContainer,
        defaultLocation,
        onLocationSelect,
        error,
    }: Props) => {
        const [styles, setStyles] = React.useState();
        const [location, setLocation] = React.useState(defaultLocation);
        const [defaultState, setDefaultState] = React.useState([0, 0] as LatLng);
        React.useEffect(() => {
            if (!defaultLocation) {
                setTimeout(() => {
                    setStyles(defaultStyles.map); // this is a workaround for the user locator button
                    // not rendering on first render in android
                }, 250);

                navigator.geolocation.getCurrentPosition(
                    ({ coords }) => {
                        setDefaultState([coords.latitude, coords.longitude])
                    },
                    (error: any) => {
                        console.log('ERROR', error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 1000,
                        maximumAge: 10000,
                    }
                );
            }
        }, []);
    const renderedLocation = location || defaultState;
    return (
        <View>
            <MapView
                region={{
                    latitude: renderedLocation[0],
                    longitude: renderedLocation[1],
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                style={styles}
                showsMyLocationButton={true}
                onPress={handlePress(onLocationSelect, setLocation)}
                showsUserLocation={true}
                zoomControlEnabled={true}
            >
                {location ? <Marker coordinate={{ longitude: location[1], latitude: location[0] }} /> : null}
            </MapView>
            <SelectedLocationContainer
                error={error}
                label="Currently Selected Location"
                location={location}
            />
        </View>
    );
};

export default LocationSelector;

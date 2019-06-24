import React from 'react';
import { View, StyleSheet } from 'react-native';
import TextField from './TextField';

import { LatLng } from '../domain/LatLng';
import MapboxGL from '@react-native-mapbox-gl/maps';

const styles = StyleSheet.create({
    matchParent: { flex: 1 }
});

const handlePress = (onLocationSelect: Props['onLocationSelect'], setLocation: (loc: LatLng) => void) => (event: any) => {
    const { geometry } = event;
    const newLocation: LatLng = [geometry.coordinates[1], geometry.coordinates[0]];
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

const mapStyle = { height: 400, width: 400 };

// mapboxgl.accessToken = process.env.REACT_APP_MAPS_TOKEN_READ_ONLY;

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
    const [location, setLocation] = React.useState(defaultLocation || [0, 0] as LatLng);
    //            <MapboxGL.MapView
    //                style={styles}
    //                centerCoordinate={[location[1], location[0]]}
    //                onPress={handlePress(onLocationSelect, setLocation)}
    //            />
    //<View style={mapStyle} id="location-selector-map"/>

    return (
        <View>
            <SelectedLocationContainer
                error={error}
                label="Currently Selected Location"
                location={location}
            />
        </View>
    );
};

export default LocationSelector;


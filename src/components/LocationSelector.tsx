import React from 'react';
import TextField from '@material-ui/core/TextField';
import { LatLng } from '../domain/LatLng';
const mapboxgl = require('mapbox-gl');

export type SelectedLocationContainerProps = {
    label: string;
    location?: LatLng;
    error?: any;
};

const InputProps = { readOnly: true };

const DefaultContainer = ({ error, label, location }: SelectedLocationContainerProps) => (
    <TextField
        fullWidth
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

mapboxgl.accessToken = process.env.REACT_APP_MAPS_TOKEN_READ_ONLY;

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
    const [location, setLocation] = React.useState(defaultLocation);
    React.useEffect(() => {
        const defaultMapLocation = defaultLocation || [0, 0];
        const map = new mapboxgl.Map({
            container: 'location-selector-map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [defaultMapLocation[1], defaultMapLocation[0]],
            zoom: 9,
        })
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: false
        }));
        map.on('click', ({ lngLat }: { lngLat: { lat: number; lng: number } }) => {
            const newLocation: LatLng = [lngLat.lat, lngLat.lng];
            onLocationSelect(newLocation);
            setLocation(newLocation);
        });
    }, []);

    return (
        <div>
            <div style={mapStyle} id="location-selector-map"/>
            <SelectedLocationContainer
                error={error}
                label="Currently Selected Location"
                location={location}
            />
        </div>
    );
};

export default LocationSelector;


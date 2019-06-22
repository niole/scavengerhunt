import React from 'react';
import { LatLng } from '../../domain/Clue';
const mapboxgl = require('mapbox-gl');

const mapStyle = { height: 400, width: 400 };

mapboxgl.accessToken = process.env.REACT_APP_MAPS_TOKEN_READ_ONLY;

type Props = {
    onLocationSelect: (location: LatLng) => void;
    defaultLocation?: LatLng;
};

const LocationSelector = ({ defaultLocation = [0, 0], onLocationSelect }: Props) => {
    React.useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'location-selector-map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [defaultLocation[1], defaultLocation[0]],
            zoom: 9,
        })
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: false
        }));
        map.on('click', ({ lngLat }: { lngLat: { lat: number; lng: number } }) => {
            onLocationSelect([lngLat.lat, lngLat.lng]);
        });
    }, []);

    return (
        <div style={mapStyle} id="location-selector-map"/>
    );
};

export default LocationSelector;


import { getDistance } from 'geolib';
import { LatLng } from '../domain/LatLng';

const MAX_DISTANCE = 10;

type HuntLocationService = {
  canSolveClue: (clueLocation: LatLng) => Promise<boolean>;
};

const DefaultHuntLocationService: HuntLocationService = {
  canSolveClue: (clueLocation: LatLng) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(({ coords }: any) => {
        const distance = getDistance(coords, { latitude: clueLocation[0], longitude: clueLocation[1] });
        if (distance <= MAX_DISTANCE) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, (error: any) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert('Please enable location tracking for this application.');
          reject(error);
        }
      })
    });
  },
};

export default DefaultHuntLocationService;

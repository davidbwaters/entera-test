import {memo} from 'preact/compat'
import { useState, useEffect } from "preact/hooks";
import "./app.css";
import { Input } from "./components/input"
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

function Component() {
  const [location, setLocation] = useState({lng: -84.311332, lat: 33.922131});

  const handleClick = (lon:number, lat:number) => {
    console.log(lon, lat)
    setLocation({lng: lon, lat: lat})
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
  })


  const containerStyle = {
    width: '100%',
    height: '100%',
    top: '0',
    left: '0'
  };

  return isLoaded ? (
    <>
      <Input handleClick={handleClick} />
      <div class="u-position-absolute u-inset-0">
        <GoogleMap center={location} zoom={16} mapContainerStyle={containerStyle}/>
      </div>
    </>
  ): <></>
}

export const App = memo(Component)
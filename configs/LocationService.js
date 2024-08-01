
//to use location services
//npm install expo-location
// https://docs.expo.dev/versions/latest/sdk/location/

//import the expo-location package and as alias it as Location
import * as Location from "expo-location"

    //function to request location permission
    const requestLocationPermission = async() => {
        try{
            //obtain the instance of Forground Location permission from the expo-location module
            const permissionObject = await Location.requestForegroundPermissionsAsync()

            if (permissionObject.status === 'granted'){
                console.log(`location permission granted`);
                return true
            }else{
                console.log(`location permission denied`);
                return false
            }

        }catch(err){
            console.log(`Error while requesting location permission: ${err}`);
        }
    }

    // useEffect( () => {
    //     requestLocationPermission()
    // }, [])

    //function to obtain lat-lng for given street address
    const doFwdGeocode = async(address) => {
        try {
            //geocodeAsync() will perform forward geocoding
            //accepts a string address
            //returns aray of any matched location coordinates
            const geocodedLocations = await Location.geocodeAsync(address)
            console.log(`geocodedLocations : ${JSON.stringify(geocodedLocations)}`);

            //check if there any location obtained from the geocodeAsync
            if (geocodedLocations !== undefined){
                //process first element of array to access the coordinates
                const result = geocodedLocations[0]

                if (result !== undefined){
                    console.log(`result : ${JSON.stringify(result)}`);
                    console.log(`result.latitude : ${result.latitude}`);
                    console.log(`result.longitude : ${result.longitude}`);

                   
                    // const outputMessage = `${address} is located at [${result.latitude}, ${result.longitude}] coordinates`
                    return result
                }else{
                    console.log(`No location coordinates available for given street address`);
                }
            }else{
                console.log(`No location coordinates available for given street address`);
            }

        } catch (error) {
            console.log(`Error while performing forward geocoding : ${error}`);
        }
    }
    
    //function to obtain street address for given coordinates
    const doReverseGeocode = async(address) => {
        try {
            //create an object representing location coordinates from user object
            const coords = {
                latitude: parseFloat(address.latitude),
                longitude: parseFloat(address.longitude)
            }

            //reverseGeocodeAsync() takes location coordinates object as a parameter and
            // returns array of any matching postal addresses
            const postalAddressList = await Location.reverseGeocodeAsync(coords, {})
            console.log(`postalAddressList : ${JSON.stringify(postalAddressList)}`);

            if (postalAddressList !== undefined){
                //process the first postal address
                const result = postalAddressList[0]

                if (result !== undefined){
                    console.log(`result : ${JSON.stringify(result)}`);

                    //formattedAddress only available in Android
                    // setReverseGecodeResultsLabel(result.formattedAddress)

                    //for iOS or to make it general on all platforms
                    const address = `${result.streetNumber} ${result.street}. ${result.city}. ${result.postalCode}`
                    setReverseGecodeResultsLabel(address)

                    console.log(`result.formattedAddress : ${result.formattedAddress}`);
                    console.log(`result.city : ${result.city}`);
                    console.log(`result.street : ${result.street}`);
                    console.log(`result.region : ${result.region}`);
                    console.log(`result.postalCode : ${result.postalCode}`);
                    console.log(`result.country : ${result.country}`);
                    // result.isoCountryCode
                    // result.subregion

                }else{
                    console.log(`No address found for given coordinates`);
                    setReverseGecodeResultsLabel(`No address found for given coordinates`)
                }
            }else{
                console.log(`No address found for given coordinates`);
                setReverseGecodeResultsLabel(`No address found for given coordinates`)
            }

        } catch (error) {
            console.log(`Error while performing reverse geocoding`);
        }
    }

    //function to access user's device location
    const getCurrLocation = async() => {
        try {
            // getCurrentPositionAsync() will fetch the current location of device 
            // for the specified accuracy
            const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest})

            if (location !== undefined){
                console.log(`Current location : ${JSON.stringify(location)}`);
                setCurrLocationLabel(`Current location : ${location.coords.latitude}, ${location.coords.longitude} `)
            
                setCurrentLocation(location)
                //show the location on map

                //create a region to represent the location
                const mapRegion = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 1,
                    longitudeDelta: 1
                }

                if (mapRef !== null){
                    //move the map to show the region
                    mapRef.current.animateToRegion(mapRegion, 1000)
                }else{
                    console.log(`MapView is null. Cannot show the location on map`);
                }
            
            
            }else{
                console.log(`Could not obtain the current device location`);
                setCurrLocationLabel(`Could not obtain the current device location`)
            }
        } catch (error) {
            console.log(`Error while accessing device location : ${error}`);
        }
    }


    export {requestLocationPermission, doFwdGeocode, doReverseGeocode}
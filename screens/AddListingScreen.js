import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import ImageTabs from "../components/ImageTabs";
import { doFwdGeocode, requestLocationPermission } from "../configs/LocationService";

const AddListingScreen = () => {
  const { control, handleSubmit, setValue } = useForm();
  const [vehicles, setVehicles] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [filteredMakes, setFilteredMakes] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchMake, setSearchMake] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    axios
      .get("https://raw.githubusercontent.com/np-mndp/GBC-CarRental-Owner-/main/assets/vehicles.json")
      .then((response) => {
        setVehicles(response.data);
        const uniqueMakes = Array.from(new Set(response.data.map((vehicle) => vehicle.make)));
        setMakes(uniqueMakes);
        setFilteredMakes(uniqueMakes);
      })
      .catch((error) => {
        console.error("Error fetching vehicle data:", error);
      });
  }, []);

  useEffect(() => {
    const filtered = makes.filter((make) =>
      make.toLowerCase().includes(searchMake.toLowerCase())
    );
    setFilteredMakes(filtered);
  }, [searchMake, makes]);

  useEffect(() => {
    const filtered = models.filter((model) =>
      model.toLowerCase().includes(searchModel.toLowerCase())
    );
    setFilteredModels(filtered);
  }, [searchModel, models]);

  const onSubmit = async (data) => {
    console.log("Location Address:", data.pickupLocation);

    // Request location permission
    const hasPermission = await requestLocationPermission();

    if (hasPermission) {
        // Convert the address to coordinates
        const coordinates = await doFwdGeocode(data.pickupLocation);
        console.log("Coordinates:", coordinates);

        if (coordinates) {
            const listingData = {
                ...data,
                coordinates,
            };
            console.log("Listing Data:", listingData);
            // Add your listing logic here
        } else {
            console.log("Failed to get coordinates");
        }
    } else {
        console.log("Location permission not granted");
    }
};


  const handleMakePress = (make) => {
    setSelectedMake(make);
    setSearchMake(make);
    const filteredModels = vehicles
      .filter((vehicle) => vehicle.make === make)
      .map((vehicle) => vehicle.model);
    const uniqueModels = Array.from(new Set(filteredModels));
    setModels(uniqueModels);
    setFilteredModels(uniqueModels);
    setSearchModel("");
    setSelectedModel("");
    setSelectedVehicle(null);
  };

  const handleModelPress = (model) => {
    setSelectedModel(model);
    setSearchModel(model);
    const vehicle = vehicles.find(
      (v) => v.make === selectedMake && v.model === model
    );
    setSelectedVehicle(vehicle);

    if (vehicle) {
      setValue("vehicleName", `${vehicle.make} ${vehicle.model} ${vehicle.trim}`);
      setValue("seatingCapacity", `${vehicle.seats_min} seats`);
      setValue("photoUrl", vehicle.images[0].url_full);
      setValue("doors", vehicle.doors);
      setValue("horsepower", vehicle.horsepower);
    }
  };

  const renderMakeItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMakePress(item)}>
      <Text style={styles.listItem}>{item}</Text>
    </TouchableOpacity>
  );

  const renderModelItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleModelPress(item)}>
      <Text style={styles.listItem}>{item}</Text>
    </TouchableOpacity>
  );

  const renderFormItem = ({ item }) => {
    switch (item.type) {
      case 'makeSearch':
        return (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Vehicle Make</Text>
            <TextInput
              style={styles.input}
              placeholder="Search make"
              value={searchMake}
              onChangeText={setSearchMake}
            />
            {searchMake !== "" && (
              <FlatList
                data={filteredMakes}
                renderItem={renderMakeItem}
                keyExtractor={(item) => item}
                style={styles.list}
              />
            )}
          </View>
        );
      case 'modelSearch':
        return selectedMake && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Vehicle Model</Text>
            <TextInput
              style={styles.input}
              placeholder="Search model"
              value={searchModel}
              onChangeText={setSearchModel}
            />
           {searchMake !== "" && (
            
              <FlatList
                data={filteredModels}
                renderItem={renderModelItem}
                keyExtractor={(item) => item}
                style={styles.list}
              />
            )}
          </View>
        );
      case 'vehicleName':
        return (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Vehicle Name</Text>
            <Controller
              name="vehicleName"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
        );
      case 'photos':
        return (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Photos</Text>
            {selectedVehicle && <ImageTabs images={selectedVehicle.images} />}
          </View>
        );
      case 'seatingCapacity':
        return (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Seating Capacity</Text>
            <Controller
              name="seatingCapacity"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
        );
      case 'doors':
        return (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Number of Doors</Text>
            <Controller
              name="doors"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value != undefined ? value.toString() : ""}
                  keyboardType="numeric"
                />
              )}
            />
          </View>
        );
      case 'horsepower':
        return (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Horsepower</Text>
            <Controller
              name="horsepower"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value != undefined ? value.toString() : ""}
                  keyboardType="numeric"
                />
              )}
            />
          </View>
        );
      case 'licensePlate':
        return (
          <View style={styles.formGroup}>
            <Text style={styles.label}>License Plate</Text>
            <Controller
              name="licensePlate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter license plate"
                />
              )}
            />
          </View>
        );
      case 'pickupLocation':
        return (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Pickup Location Address</Text>
            <Controller
              name="pickupLocation"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter pickup location"
                />
              )}
            />
          </View>
        );
      case 'rentalPrice':
        return (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Rental Price (per week)</Text>
            <Controller
              name="rentalPrice"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter rental price"
                  keyboardType="numeric"
                />
              )}
            />
          </View>
        );
      case 'submit':
        return (
          <View style={styles.formGroup}>
            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
          </View>
        );
      default:
        return null;
    }
  };

  // Define the data structure for FlatList
  const formItems = [
    { type: 'makeSearch' },
    { type: 'modelSearch' },
    { type: 'vehicleName' },
    { type: 'photos' },
    { type: 'seatingCapacity' },
    { type: 'doors' },
    { type: 'horsepower' },
    { type: 'licensePlate' },
    { type: 'pickupLocation' },
    { type: 'rentalPrice' },
    { type: 'submit' }
  ];

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={formItems}
      renderItem={renderFormItem}
      keyExtractor={(item) => item.type}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  list: {
    maxHeight: 150,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default AddListingScreen;

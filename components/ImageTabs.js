import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

const ImageTabs = ({ images }) => {
  const renderScene = SceneMap(
    images.reduce((scenes, image, index) => {
      scenes[`tab${index}`] = () => (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.url_full }} style={styles.image} />
        </View>
      );
      return scenes;
    }, {})
  );

  return (
    <TabView
      navigationState={{
        index: 0,
        routes: images.map((_, index) => ({
          key: `tab${index}`,
          title: `Image ${index + 1}`,
        })),
      }}
      renderScene={renderScene}
      onIndexChange={() => {}}
      initialLayout={{ width: 400 }}
    />
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
});

export default ImageTabs;

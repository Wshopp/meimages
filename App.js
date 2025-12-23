import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import CameraRoll from '@react-native-camera-roll/camera-roll';

export default function App() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      loadImages();
    } else {
      Alert.alert('Permission denied');
    }
  };

  const loadImages = async () => {
    const result = await CameraRoll.getPhotos({
      first: 50,
      assetType: 'Photos',
    });
    setPhotos(result.edges);
  };

  const deleteImage = async uri => {
    Alert.alert('Delete Image?', 'Are you sure?', [
      {text: 'Cancel'},
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await CameraRoll.deletePhotos([uri]);
            loadImages();
          } catch (e) {
            Alert.alert('Error deleting image');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Gallery</Text>

      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onLongPress={() =>
              deleteImage(item.node.image.uri)
            }>
            <Image
              source={{uri: item.node.image.uri}}
              style={styles.image}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 40},
  title: {fontSize: 22, textAlign: 'center', marginBottom: 10},
  image: {width: 120, height: 120, margin: 2},
});

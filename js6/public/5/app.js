import React, { useState, useEffect, useRef } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermisssion] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermisssion(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (this.camera) {
      const image = await this.camera.takePictureAsync({quality: 0.6, base64: true});    
      const fetchOptions = {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          data: image.base64
        })
      };
    fetch('http://localhost:8123', fetchOptions);    
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={takePicture}
        title="Selfie Time"
        color="#841584"
        accessibilityLabel="Selfie Button"
      />  
      <Text style={styles.paragraph}>
        Permission State: { hasPermission ? 'Granted': 'Rejected' }
      </Text>
      <Camera 
        style={{ flex: 0.5 }} 
        type={type}
        ref={ref => {
          this.camera = ref;
        }}
      >
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, Fragment, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PixelRatio,
  Image,
  Linking,
  Dimensions,
  TextInput,
  ScrollView,
  FlatList
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Icon, Container, Header, Left, Button, Body, Title, Right } from 'native-base';

import Spinner from './components/Spinner';
import Card from './components/Card';
import TextContainer from './components/TextContainer';

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const { height, width } = Dimensions.get('window');

const App = () => {
  const [avatarSource, setAvatarSource] = useState(null);
  const [loading, setLoading] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [clickUpload, setClickUpload] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [label, setLabel] = useState('');
  const [images, setImages] = useState([]);
  const [uri, setUri] = useState('');
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const config = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    };

    fetch('http://10.0.2.2:5000/images', config)
      .then((resp) => resp.json())
      .then((res) => {
        setImages(res);
        setFetchLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setFetchLoading(false);
      });
  }, []);

  const createAdminSignedContract = () => {
    const contractAddress = '0x13F68498cC89d195C12741c426348B65b74832Ff';
    const privateKey = 'a8c80296d57ea1606736a7cf5d3e07f73f9aef581c049c313e6ba53a684f660c';
    const url = 'http://127.0.0.1:7545';
    const provider = new ethers.providers.JsonRpcProvider(url);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new Contract(contractAddress, abi, signer);
    return contract;
  };

  const selectImage = async () => {
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        setError('Image upload failed');
        setLoading(null);
      } else if (response.error) {
        setError('Image upload failed');
        setLoading(null);
      } else if (response.customButton) {
        setError('Image upload failed');
        setLoading(null);
      } else {
        const source = { uri: response.uri };
        setUploadStatus(true);
        setAvatarSource(source);
        setUri(response.uri);
        setType(response.type);
        setName(response.fileName);
        setOriginalName(response.fileName);

        global.data = new FormData();

        data.append('file', {
          uri: response.uri,
          type: response.type,
          name: response.fileName,
          originalname: response.fileName,
        });

        const config = {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        };
      }
    });
  };

  const upload = async () => {
    setLoading(true);
    if (!uploadStatus) {
      setLoading(null);
      return alert('Image yet to be uploaded');
    }
    if (label === '') {
      setLoading(null);
      return alert('Enter image label');
    } else {
      data.append('label', label);
      const config = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      };

      fetch('http://10.0.2.2:5000/upload', config)
        .then((resp) => resp.json())
        .then((res) => {
          setLabel(res.label);
          setHash(res.ipfsHash);
          setAddress(res.ipfsAddress);
          setTransactionHash(res.transactionHash);
          setBlockHash(res.blockHash);
          setLoading(false);
          setImages((prevState) => [...prevState, res]);
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    }
  };

  const newUploadScreen = () => {
    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <View>
            <Text style={{ color: 'blue' }}>  DAPP file system using ethereum and IPFS </Text>
          </View>
          <View style={{ marginTop: '10%', flex: 1 }}>
            <TouchableOpacity onPress={() => selectImage()}>
              <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
                {avatarSource === null ? <Text>Select a Photo</Text> : <Image style={styles.avatar} source={avatarSource} />}
              </View>
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
              <TextInput
                placeholder="Label"
                onChangeText={(label) => setLabel(label)}
                style={styles.label}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={{ alignItems: 'center', marginTop: '10%' }}>
              <TouchableOpacity onPress={() => upload()} style={[styles.label, { justifyContent: 'center', backgroundColor: '#8470ff' }]}>
                <Text style={{ fontWeight: 'bold' }}>  UPLOAD </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {loading !== null ? (
          loading ? (
            <Spinner size="large" />
          ) : (
            <View>
              <TextContainer first="Label" second={label} />
              <TextContainer first="Hash" second={hash} />
              <TextContainer
                first="Address on IPFS"
                second={address}
                link={() => Linking.openURL(address)}
                style={{ color: 'blue', textDecorationLine: 'underline' }}
              />
              <TextContainer first="Transaction Hash" second={transactionHash} />
              <TextContainer first="Block Hash" second={blockHash} />
            </View>
          )
        ) : null}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flex: 1 }}
    >
      <View>
        <Header>
          <Body>
            {!clickUpload ? (
              <Title> DAPP images listing </Title>
            ) : (
              <Title> New Image upload </Title>
            )}
          </Body>
          <Right>
            <Button transparent onPress={() => setClickUpload(!clickUpload)}>
              {!!clickUpload ? (
                <Text> HOME </Text>
              ) : (
                <Text> ADD </Text>
              )}
            </Button>
          </Right>
        </Header>
      </View>
      {clickUpload ? (
        newUploadScreen()
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
          {fetchLoading ? (
            <View style={{ flex: 1, marginTop: '40%' }}>
              <Spinner size="large" />
            </View>
          ) : (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
              <Fragment>
                {images.length === 0 ? (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => setClickUpload(!clickUpload)}
                      style={[styles.label, { justifyContent: 'center', backgroundColor: '#8470ff' }]}
                    >
                      <Text style={{ fontWeight: 'bold' }}>  ADD </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <FlatList
                    data={images}
                    extraData={images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(item, index) => {
                      return (
                        <Card
                          key={index}
                          state={this.state}
                          createdAt={item.item.createdAt}
                          address={item.item.ipfsAddress}
                          blockHash={item.item.blockHash}
                          transactionHash={item.item.transactionHash}
                          label={item.item.label}
                        />
                      );
                    }}
                  />
                )}
              </Fragment>
            </ScrollView>
          )}
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: width / 3,
    width: width / 2,
    height: width / 2,
  },
  label: {
    height: 40,
    width: width / 4,
    paddingLeft: '8%',
    borderWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default App;

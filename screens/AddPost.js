import {
  Keyboard,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/AppStyles";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { deleteUser } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tags } from "../utils/tags";
import uuid from "react-native-uuid";
import * as ImagePicker from "expo-image-picker";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { set } from "react-native-reanimated";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const [userQues, setUserQues] = useState("");
  const [tags, setTags] = useState("");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getUsername = () => {
      try {
        AsyncStorage.getItem("Username").then((value) => {
          setUsername((prev) => value);
          setTitle((prev) => "");
          setQuery((prev) => "");
          getUserQuestions(value);
        });
      } catch (err) {
        console.log(err);
      }
    };
    getUsername();
  }, []);

  async function uploadImage(fileUri) {
    let format
    if( fileUri.includes(".png?")) format = "png"
    else if( fileUri.includes(".jpg?")) format = "jpg"
    else if( fileUri.includes(".jpeg?")) format = "jpeg"
    else if( fileUri.includes(".gif?")) format = "gif"
    else if( fileUri.includes(".bmp?")) format = "bmp"
    else if( fileUri.includes(".webp?")) format = "webp"
    else if( fileUri.includes(".svg?")) format = "svg"
    else if( fileUri.includes(".ico?")) format = "ico"
    else if( fileUri.includes(".tiff?")) format = "tiff"
    else if( fileUri.includes(".tif?")) format = "tif"
    else if( fileUri.includes(".psd?")) format = "psd"
    else if( fileUri.includes(".raw?")) format = "raw"
    else if( fileUri.includes(".heif?")) format = "heif"
    else if( fileUri.includes(".indd?")) format = "indd"
    else if( fileUri.includes(".jpeg2000?")) format = "jpeg2000"
    else if( fileUri.includes(".exif?")) format = "exif"
    else if( fileUri.includes(".ppm?")) format = "ppm"
    else if( fileUri.includes(".pgm?")) format = "pgm"
    else if( fileUri.includes(".pbm?")) format = "pbm"
    else if( fileUri.includes(".pnm?")) format = "pnm"
    else if( fileUri.includes(".webp?")) format = "webp"
    else if( fileUri.includes(".heic?")) format = "heic"
    else if( fileUri.includes(".bat?")) format = "bat"
    else if( fileUri.includes(".cmd?")) format = "cmd"
    else if( fileUri.includes(".apk?")) format = "apk"
    else if( fileUri.includes(".app?")) format = "app"
    else if( fileUri.includes(".exe?")) format = "exe"
    else if( fileUri.includes(".ipa?")) format = "ipa"
    else if( fileUri.includes(".jar?")) format = "jar"
    else if( fileUri.includes(".msi?")) format = "msi"
    else if( fileUri.includes(".vb?")) format = "vb"
    else if( fileUri.includes(".vbs?")) format = "vbs"
    else if( fileUri.includes(".wsf?")) format = "wsf"
    else if( fileUri.includes(".3g2?")) format = "3g2"
    else if( fileUri.includes(".3gp?")) format = "3gp"
    else if( fileUri.includes(".avi?")) format = "avi"
    else if( fileUri.includes(".flv?")) format = "flv"
    else if( fileUri.includes(".h264?")) format = "h264"
    else if( fileUri.includes(".m4v?")) format = "m4v"
    else if( fileUri.includes(".mkv?")) format = "mkv"
    else if( fileUri.includes(".mov?")) format = "mov"
    else if( fileUri.includes(".mp4?")) format = "mp4"
    else if( fileUri.includes(".mpg?")) format = "mpg"
    else if( fileUri.includes(".mpeg?")) format = "mpeg"
    else format = "jpeg"
    const metadata = {
      contentType: "image/" + format,
    }
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `${fileUri.split("/").pop()}`);
    const snapshot = await uploadBytes(storageRef, blob, metadata);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  }

  const newPost = async () => {
    setError((prev) => "");
    setAdding((prev) => true);
    console.log("adding ques");
    const tagsArr = tags.split("@");
    const imagesUrl = [];
    if (images.length > 0 && imagesUrl.length < images.length) {
      for (let i = 0; i < images.length; i++) {
        const url = await uploadImage(images[i]);
        imagesUrl.push(url);
      }
    }
    console.log(imagesUrl);
    await setDoc(doc(db, "questions", username), {
      questions: [
        ...userQues,
        {
          id: uuid.v4(),
          date: new Date().toISOString(),
          // author: auth.currentUser.displayName ? auth.currentUser.displayName : auth.currentUser.email,
          // author_mail: auth.currentUser.email,
          author: username,
          title: title,
          query: query,
          tags: tagsArr,
          open: true,
          votes: 0,
          voters: [],
          images: imagesUrl,
        },
      ],
    });
    setTitle((prev) => "");
    setQuery((prev) => "");
    setTags((prev) => "");
    setAdding((prev) => false);
    setAdded((prev) => true);
    setImages((prev) => []);
    setTimeout(() => {
      setAdded((prev) => false);
    }, 1500);
    Keyboard.dismiss();
  };

  const getUserQuestions = async (value) => {
    const docRef = doc(db, "questions", value);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data().questions);
      setUserQues(docSnap.data().questions);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const [hasGalleryPermissions, setHasGalleryPermissions] = useState(null);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [images, setImages] = useState([]);

  const handleImage = async () => {
    setImageError((prev) => "");
    if (!hasGalleryPermissions) {
      setImageError((prev) => "*Please grant gallery access.");
    } else {
      if (images.length >= 3) {
        setImageError((prev) => "*Please select upto 3 images.");
        return;
      }
      await pickImage();
      console.log(image);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });
    console.log(result);
    if (!result.cancelled) {
      if (!result?.selected) result = { selected: [result] };
      if (images.length + result?.selected?.length > 3) {
        setImages((prev) => [
          ...prev,
          ...result?.selected
            ?.slice(0, 3 - images.length)
            .map((item) => item.uri),
        ]);
        setImageError((prev) => "*Please select upto 3 images.");
        return;
      }
      setImages((prev) => [
        ...prev,
        ...result.selected.map((item) => item.uri),
      ]);
    }
  };

  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermissions((prev) => galleryStatus.status === "granted");
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
      {/* {!adding &&  */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={[styles.container, { justifyContent: "flex-end" }]}
          behavior="padding"
        >
          <View
            style={[
              styles.inputContainer,
              {
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingBottom: 32,
                backgroundColor: "#fff",
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                elevation: 8,
              },
            ]}
          >
            <View
              style={{
                alignSelf: "center",
                marginVertical: 16,
                backgroundColor: "rgba(0,0,0,0.1)",
                borderRadius: 8,
                width: "25%",
                height: 6,
              }}
            ></View>
            <View>
              <Text
                style={[
                  styles.header,
                  { marginBottom: 16, alignSelf: "flex-start" },
                ]}
              >
                Post your query
              </Text>
              <View style={[styles.inputField, { marginBottom: 8 }]}>
                <TextInput
                  multiline={true}
                  numberOfLines={2}
                  placeholder="Title..."
                  style={[
                    styles.input,
                    styles.input_post,
                    styles.marginVertical,
                  ]}
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                />
              </View>
              <View style={[styles.inputField, { marginBottom: 8 }]}>
                <TextInput
                  multiline={true}
                  numberOfLines={10000}
                  placeholder="Add query..."
                  style={[
                    styles.input,
                    styles.input_post,
                    styles.marginVertical,
                    { height: 140, textAlignVertical: "top" },
                  ]}
                  value={query}
                  onChangeText={(text) => setQuery(text)}
                />
              </View>
              <Text style={{ marginVertical: 8 }}>
                {query.length} characters
              </Text>
              <TextInput
                value={tags}
                onChangeText={(text) => setTags((prev) => text)}
                style={[
                  styles.input,
                  styles.input_post,
                  { color: "rgb(24,152,254)", fontSize: 16 },
                ]}
                placeholder="Add tags... For Example: @Nodejs @Reactjs..."
                keyboardType="twitter"
              />
            </View>
            {images?.length < 3 && (
              <TouchableOpacity
                onPress={handleImage}
                style={[{ marginVertical: 16 }]}
              >
                <MaterialIcons
                  name="add-photo-alternate"
                  size={32}
                  color={"rgba(0,0,0,0.2)"}
                />
              </TouchableOpacity>
            )}
            <ScrollView
              horizontal={true}
              style={{ marginVertical: 16 }}
              showsHorizontalScrollIndicator={true}
            >
              {images?.map((item, index) => (
                <View style={{ padding: 4, position: "relative" }}>
                  <TouchableOpacity
                    onPress={() =>
                      setImages((prev) =>
                        prev?.filter((img, index) => img !== item)
                      )
                    }
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      zIndex: 1,
                    }}
                  >
                    <MaterialIcons
                      name="cancel"
                      size={24}
                      color={"rgba(255,255,255,0.9)"}
                    />
                  </TouchableOpacity>
                  <Image
                    source={{ uri: item }}
                    style={{ width: 100, height: 100 }}
                    resizeMode="cover"
                  ></Image>
                </View>
              ))}
            </ScrollView>
            {imageError !== "" && (
              <Text style={{ color: "red", textAlign: "center" }}>
                {imageError}
              </Text>
            )}
            <View style={{ display: "flex" }}>
              <TouchableOpacity
                disabled={adding}
                onPress={() => {
                  if (title !== "" && query !== "") newPost();
                  else
                    setError(
                      (prev) => "All fields are required to post a query."
                    );
                }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {adding ? "Adding..." : "Post"}
                </Text>
              </TouchableOpacity>
              {error !== "" && (
                <Text style={{ color: "red", textAlign: "center" }}>
                  {error}
                </Text>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {/* {adding &&
      <View>
      <Image source={require('../assets/login1.png')} style={{width: 270, height: 310}} resizeMode='contain'></Image>
  </View>} */}
    </SafeAreaView>
  );
};

export default AddPost;

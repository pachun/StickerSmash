import { useRef, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, View, ImageSourcePropType, Platform } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as MediaLibrary from "expo-media-library"
import { captureRef } from "react-native-view-shot"
import domtoimage from "dom-to-image"

import Button from "./components/Button"
import IconButton from "./components/IconButton"
import CircleButton from "./components/CircleButton"
import PlaceholderImage from "./assets/images/background-image.png"
import EmojiPicker from "./components/EmojiPicker"
import EmojiList from "./components/EmojiList"
import EmojiSticker from "./components/EmojiSticker"

import ImageViewer from "./components/ImageViewer"

export default function App() {
  const imageRef = useRef<View>(null)
  const [selectedImage, setSelectedImage] = useState<string>()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false)
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType>()
  const [status, requestPermission] = MediaLibrary.usePermissions()

  if (!Boolean(status)) {
    requestPermission()
  }

  const onReset = () => setShowAppOptions(false)

  const onAddSticker = () => setIsModalVisible(true)

  const onModalClose = () => setIsModalVisible(false)

  const onSaveImageAsync = async () => {
    if (Platform.OS !== "web") {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        })

        await MediaLibrary.saveToLibraryAsync(localUri)
        if (localUri) {
          alert("Saved!")
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      domtoimage
        .toJpeg(imageRef.current as unknown as Node, {
          quality: 0.95,
          width: 320,
          height: 440,
        })
        .then((dataUrl: string) => {
          let link = document.createElement("a")
          link.download = "sticker-smash.jpeg"
          link.href = dataUrl
          link.click()
        })
        .catch((e: string) => {
          console.log(e)
        })
    }
  }
  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    })
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setShowAppOptions(true)
    } else {
      alert("You did not pick an image.")
    }
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer
            placeholderImageSource={PlaceholderImage}
            selectedImage={selectedImage}
          />
          {Boolean(pickedEmoji) ? (
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          ) : null}
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button
            label="Choose a photo"
            theme="primary"
            onPress={pickImageAsync}
          />
          <Button
            label="Use this photo"
            onPress={() => setShowAppOptions(true)}
          />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
})

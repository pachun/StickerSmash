import { StyleSheet, Image, ImageSourcePropType } from "react-native"

const ImageViewer = ({
  placeholderImageSource,
  selectedImage,
}: {
  placeholderImageSource: ImageSourcePropType
  selectedImage?: string
}) => (
  <Image
    source={
      Boolean(selectedImage) ? { uri: selectedImage } : placeholderImageSource
    }
    style={styles.image}
  />
)

const styles = StyleSheet.create({
  image: { width: 320, height: 440, borderRadius: 18 },
})

export default ImageViewer

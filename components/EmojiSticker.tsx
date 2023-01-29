import { View, Image, ImageSourcePropType } from "react-native"

const EmojiSticker = ({
  imageSize,
  stickerSource,
}: {
  imageSize: number
  stickerSource?: ImageSourcePropType
}) => (
  <View style={{ top: -350 }}>
    <Image
      source={stickerSource}
      resizeMode="contain"
      style={{ width: imageSize, height: imageSize }}
    />
  </View>
)

export default EmojiSticker

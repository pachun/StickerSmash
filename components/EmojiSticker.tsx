import { View, Image, ImageSourcePropType } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from "react-native-reanimated"
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler"

const AnimatedView = Animated.createAnimatedComponent(View)
const AnimatedImage = Animated.createAnimatedComponent(Image)

const EmojiSticker = ({
  imageSize,
  stickerSource,
}: {
  imageSize: number
  stickerSource?: ImageSourcePropType
}) => {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const scaleImage = useSharedValue(imageSize)

  const onDrag = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { translateX: number; translateY: number }
  >({
    onStart: (_event, context) => {
      context.translateX = translateX.value
      context.translateY = translateY.value
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX
      translateY.value = event.translationY + context.translateY
    },
  })

  const onDoubletap = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onActive: () => {
      if (Boolean(scaleImage.value)) {
        scaleImage.value = scaleImage.value * 2
      }
    },
  })

  const imageStyle = useAnimatedStyle(() => ({
    width: withSpring(scaleImage.value),
    height: withSpring(scaleImage.value),
  }))

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }))

  return (
    <PanGestureHandler onGestureEvent={onDrag}>
      <AnimatedView style={[containerStyle, { top: -350 }]}>
        <TapGestureHandler onGestureEvent={onDoubletap} numberOfTaps={2}>
          <AnimatedImage
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { width: imageSize, height: imageSize }]}
          />
        </TapGestureHandler>
      </AnimatedView>
    </PanGestureHandler>
  )
}

export default EmojiSticker

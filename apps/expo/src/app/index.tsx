import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";

import type { RouterType } from "@acme/nextjs/src/pages/api/uploadthing";

import { generateReactHelpers } from "~/utils/useUploadThing";

const { uploadThing } = generateReactHelpers<RouterType>();

const Index = () => {
  const [file, setFile] = useState<ImagePicker.ImagePickerResult | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Callback to launch image picker
  const selectDocument = useCallback(async () => {
    const response = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!response.canceled) {
      setFile(response);
      const fileUri = await uploadThing({
        file: response,
        endpoint: "upload",
        onUploadProgress({ file: _file, progress }) {
          setTimeout(() => setProgress(progress), progress * 50);
        },
      });
      setFileUri(fileUri);
      setProgress(0);
    } else {
      setFile(null);
      setFileUri(null);
    }
  }, []);

  useEffect(() => {
    if (fileUri) {
      console.log("Successfully uploaded at", fileUri);
    }
  }, [fileUri]);

  return (
    <SafeAreaView className="bg-[#1F104A]">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="flex h-full w-full flex-col items-center justify-center">
        <View
          className="mx-4 my-1 flex h-1/2 items-center justify-center rounded-lg border-2 border-white"
          style={{ width: Dimensions.get("screen").width - 32 }}
        >
          {file && !file.canceled && file.assets && file.assets.length > 0 ? (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${file.assets[0]!.base64}`,
              }}
              alt={"Selected file"}
              style={{ width: 200, height: 200 }}
            />
          ) : progress === 0 ? (
            <Text className="text-xl font-semibold text-white">
              No image selected
            </Text>
          ) : (
            <Text className="text-xl font-semibold text-white">
              Uploading {progress}%
            </Text>
          )}
        </View>
        <Text
          className="mx-4 mt-2 rounded-lg bg-blue-500/80 py-2 text-center text-lg font-bold text-white"
          style={{ width: Dimensions.get("screen").width - 32 }}
          onPress={() => void selectDocument()}
        >
          Upload Banner
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Index;

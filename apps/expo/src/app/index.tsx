import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { ImageUploader } from "~/utils/uploadthing";

export default function Index() {
  return (
    <SafeAreaView className=" bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Upload<Text className="text-red-600">Thing</Text>
        </Text>

        <ImageUploader
          endpoint={"videoAndImage"}
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
            console.warn(error.cause);
            console.warn(error.stack);
          }}
          onUploadProgress={(progress: number) => {
            console.log(progress)
          }}
        />
      </View>
    </SafeAreaView>
  );
}

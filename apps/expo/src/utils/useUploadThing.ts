import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { genUploader } from "uploadthing/client";
import type { FileRouter, inferEndpointInput } from "uploadthing/server";

import { getBaseUrl } from "./api";

type FileType = {
  uri: string;
} & NonNullable<ImagePicker.ImagePickerResult["assets"]>[number];

export function generateReactHelpers<RouterType extends FileRouter>() {
  const uploadFiles = genUploader<RouterType>();

  const uploadThing = async ({
    file,
    endpoint,
    input,
    onUploadProgress,
  }: {
    file: ImagePicker.ImagePickerSuccessResult;
    endpoint: keyof RouterType;
    input?: inferEndpointInput<RouterType[typeof endpoint]>;
    onUploadProgress?: ({
      file,
      progress,
    }: {
      file: string;
      progress: number;
    }) => void;
  }) => {
    return await uploadFiles(
      {
        endpoint,
        files: file.assets.map((asset) => {
          const fileName =
            asset.fileName || asset.uri.split("/").pop() || "image.jpeg";

          return {
            uri: asset.uri,
            name: fileName,
            type: `image/${fileName.split(".").pop()}`,
          } as unknown as File;
        }),
        input,
        onUploadProgress,
      },
      {
        url: `${getBaseUrl()}/api/uploadthing`,
      },
    );
  };

  return {
    uploadThing,
    useUploadThing: (endpoint: keyof RouterType) => {
      const [files, setFiles] = useState<FileType[]>([]);

      const selectDocument = useCallback(async () => {
        const response = await ImagePicker.launchImageLibraryAsync({
          base64: true,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
        });

        if (!response.canceled) {
          setFiles([
            ...files,
            {
              ...response.assets[0]!,
              uri: (await uploadThing({ file: response, endpoint }))[0]!
                .fileUrl,
            },
          ]);
        }
      }, [endpoint, files]);

      return {
        files,
        getInputProps: () => ({
          onPress: () => void selectDocument(),
        }),
      };
    },
  };
}

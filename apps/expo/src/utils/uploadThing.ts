import type * as ImagePicker from "expo-image-picker";
import { genUploader } from "uploadthing/client";

import type { RouterType } from "@acme/nextjs/src/pages/api/uploadthing";

import { getBaseUrl } from "./api";

const uploadFiles = genUploader<RouterType>();

export const uploadThing = async (
  file: ImagePicker.ImagePickerSuccessResult,
) => {
  const fileName =
    file.assets[0]!.fileName ||
    file.assets[0]!.uri.split("/").pop() ||
    "image.jpeg";

  return (
    (
      await uploadFiles(
        [
          {
            uri: file.assets[0]!.uri,
            name: fileName,
            type: `image/${fileName.split(".").pop()}`,
          },
        ],
        "upload",
        {
          url: `${getBaseUrl()}/api/uploadthing`,
        },
      )
    )[0] as { fileUrl: string }
  ).fileUrl;
};

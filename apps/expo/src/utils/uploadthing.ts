import { generateImageUploader } from "@uploadthing/react-native";

import type { OurFileRouter } from "@acme/api/uploadthing";

export const ImageUploader = generateImageUploader<OurFileRouter>({
  url: new URL("http://10.0.0.62:3000/api/uploadthing"),
});

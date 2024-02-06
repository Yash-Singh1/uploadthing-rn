import { createRouteHandler } from "uploadthing/next";

import { uploadRouter } from "@acme/api/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});

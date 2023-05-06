// Handler for uploading files to S3

import {
  createFilething,
  createNextPageApiHandler,
  type FileRouter,
} from "uploadthing/server";

const f = createFilething();

const router = {
  upload: f
    .fileTypes(["image"])
    .maxSize("1GB")
    // eslint-disable-next-line @typescript-eslint/require-await
    .middleware(async (...args) => {
      console.log("middleware", args);
      return {};
    })
    .onUploadComplete(console.log),
} satisfies FileRouter;

export type RouterType = typeof router;

const handler = createNextPageApiHandler({
  router,
});

export default handler;

// Handler for uploading files to S3

import {
  createNextPageApiHandler,
  createUploadthing,
  type FileRouter,
} from "uploadthing/next-legacy";

const f = createUploadthing();

const router = {
  upload: f({ image: { maxFileSize: "1GB" } })
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

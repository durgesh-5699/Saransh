import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter ={

    pdfUploader: f({pdf:{maxFileSize:"32MB"}}).
    middleware(
        async ({req}) => {
            const user = await currentUser();
            if(!user) throw new UploadThingError('Unauthorized You must be logged in to upload files');
            return {userId:user.id};
        }
    ).onUploadComplete(async ({metadata, file})=>{
        return {uploadedBy: metadata.userId,file};
    })

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
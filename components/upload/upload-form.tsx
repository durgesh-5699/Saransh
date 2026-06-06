"use client";
import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: "file size must be less then 20 MB",
    })
    .refine((file) => file.type.startsWith("application/pdf"), {
      message: "File must be a PDF",
    }),
});

export default function UploadForm() {
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
      toast.success("PDF uploaded successfully!");
    },

    onUploadError: (error) => {
      console.error("error occurred while uploading", error);

      toast.error("Error occurred while uploading", {
        description: error.message,
      });
    },

    onUploadBegin: ({ file }) => {
      console.log("upload has begun for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    //schema with zod
    const validatedFields = schema.safeParse({ file });
    console.log(validatedFields);

    //validating the fields
    if (!validatedFields.success) {
      console.log(validatedFields.error.issues?.[0] ?? "Invalid file");

      toast.error("Something went wrong", {
        description:
          validatedFields.error.issues?.[0].message ?? "Invalid file",
      });

      return;
    }

    toast.loading("Uploading PDF...", {
      description: "We are uploading your PDF!",
      id: "upload-pdf",
    });

    //upload the file to uploadthing
    const response = await startUpload([file]);

    if (!response) {
      toast.error("Something went wrong", {
        description: "Please use a different file.",
      });

      return;
    }

    toast.success("Upload completed!", {
      description: "Your PDF has been uploaded successfully.",
      id: "upload-pdf",
    });

    toast.info("Processing PDF...", {
      description: "Hang tight! Our AI is reading your document! ✨",
    });

    //parse the pdf using langchain
    //summarize the pdf using AI
    //save the summary to database
    //redirect to the [id] summary page
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}
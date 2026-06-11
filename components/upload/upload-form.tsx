"use client";
import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { toast } from "react-toastify";
import generatePdfSummary from "@/actions/upload-actions";
import { useRef, useState } from "react";

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
  const formRef = useRef<HTMLFormElement>(null);
  const [loading,setIsLoading] = useState(false);

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },

    onUploadError: (error) => {
      console.error("error occurred while uploading", error);
      toast.error(`Error occurred while uploading \n ${error.message}`);
    },

    onUploadBegin: (fileName) => {
      console.log("upload has begun for", fileName);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      //schema with zod
      const validatedFields = schema.safeParse({ file });
      console.log(validatedFields);

      //validating the fields
      if (!validatedFields.success) {
        console.log(validatedFields.error.issues?.[0] ?? "Invalid file");
        toast.error(
          `Something went wrong \n ${validatedFields.error.issues?.[0].message ?? "Invalid file"}`,
        );
        setIsLoading(false);
        return;
      }

      toast.loading(`Uploading PDF... \n We are uploading your PDF!`);
      //upload the file to uploadthing
      const response = await startUpload([file]);
      toast.dismiss();
      if (!response) {
        toast.error(`Something went wrong \n Please use a different file.`);
        setIsLoading(false);
        return;
      }

      toast.success("PDF uploaded successfully!");
      //parse the pdf using langchain
      const result = await generatePdfSummary(response);

      const { data = null, message = null } = result || {};

      if (data) {
        toast.info(`Hang tight! We are saving your summary! ✨`);
        formRef.current?.reset();
        if(data.summary){
          
        }
      }

      //summarize the pdf using AI
      //save the summary to database
      //redirect to the [id] summary page
    } catch (error) {
      console.log("error occured", error);
      setIsLoading(false);
      formRef.current?.reset();
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput loading={loading} ref={formRef} onSubmit={handleSubmit} />
    </div>
  );
}

/*
    toast.dismiss();
    toast.info(
      `Processing PDF... \n Hang tight! Our AI is reading your document! ✨`,
    );
*/

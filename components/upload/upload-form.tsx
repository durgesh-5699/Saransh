"use client";
import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { toast } from "react-toastify";
import generatePdfSummary, {
  generatePdfText,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from "./loading-skeleton";
import { formatFileNameAsTitle } from "@/utils/format-utils";

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
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },

    onUploadError: (error) => {
      console.error("error occurred while uploading", error);
      toast.error(`Error occurred while uploading \n ${error.message}`);
    },

    onUploadBegin: (data) => {
      console.log("upload has begun for", data);
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

      //uploading the file to uploadthing
      const uploadResponse = await startUpload([file]);
      toast.dismiss();
      if (!uploadResponse) {
        toast.error(`Something went wrong \n Please use a different file.`);
        setIsLoading(false);
        return;
      }

      toast.success("PDF uploaded successfully!");

      const uploadFieUrl = uploadResponse[0]?.serverData?.fileUrl;
      toast.dismiss();
      let storeResult: any;
      toast.info(`Hang tight! We are saving your summary! ✨`);

      const formatedFileName = formatFileNameAsTitle(file?.name);
      //parse the pdf using langchain
      const result = await generatePdfText({
        fileUrl: uploadFieUrl,
      });
      //generate pdf sumary using AI
      const summaryResult = await generatePdfSummary({
        pdfText: result?.data?.pdfText ?? "",
        fileName: formatedFileName,
      });

      const { data = null, message = null } = summaryResult || {};
      if (data?.summary) {
        const finalSummary = typeof data.summary === "string"? data.summary: JSON.stringify(data.summary);
        //save the summary to database
        storeResult = await storePdfSummaryAction({
          summary: finalSummary,
          fileUrl: uploadFieUrl,
          title: formatedFileName,
          fileName: file?.name,
        });

        toast.dismiss();
        toast.success(`Your PDF has been successfully summarized and saved ✨`);
        formRef.current?.reset();
        //redirect to the [id] summary page
        router.push(`/summaries/${storeResult.data.id}`);
      }
    } catch (error) {
      console.log("error occured", error);
      setIsLoading(false);
      formRef.current?.reset();
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground text-sm">
            Upload PDF
          </span>
        </div>
      </div>
      <UploadFormInput
        loading={loading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
      {loading && (
        <>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm">
                Processing
              </span>
            </div>
          </div>

          <LoadingSkeleton />
        </>
      )}
    </div>
  );
}

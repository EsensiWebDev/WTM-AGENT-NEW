"use client";

import { uploadCertificate } from "@/app/(protected)/settings/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

type CertificateUploaderProps = {
  certificateUrl?: string | null;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = ".pdf,.jpg,.jpeg,.png,.doc,.docx";

export const CertificateUploader: React.FC<CertificateUploaderProps> = ({
  certificateUrl,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = React.useState<string | null>(
    null,
  );
  const [displayCertificateUrl, setDisplayCertificateUrl] = React.useState<
    string | null | undefined
  >(certificateUrl);
  const [isPending, startTransition] = React.useTransition();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setDisplayCertificateUrl(certificateUrl);
  }, [certificateUrl]);

  const resetSelection = React.useCallback(() => {
    setSelectedFile(null);
    setPreviewDataUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        resetSelection();
      }
    },
    [resetSelection],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Check file type
    const acceptedTypes = ACCEPTED_FILE_TYPES.split(",");
    const fileType = "." + file.name.split(".").pop()?.toLowerCase();
    const isFileTypeValid = acceptedTypes.some((type) => type === fileType);

    if (
      !isFileTypeValid &&
      !file.type.startsWith("image/") &&
      file.type !== "application/pdf"
    ) {
      toast.error(
        `Please select a valid file. Accepted formats: ${ACCEPTED_FILE_TYPES}`,
      );
      resetSelection();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 2MB. Please choose a smaller file.");
      resetSelection();
      return;
    }

    // For image files, create preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : null;
        setPreviewDataUrl(result);
        setSelectedFile(file);
      };

      reader.onerror = () => {
        toast.error("Failed to read the selected file. Please try again.");
        resetSelection();
      };

      reader.readAsDataURL(file);
    } else {
      // For non-image files, just set the file
      setPreviewDataUrl(null);
      setSelectedFile(file);
    }
  };

  const handleSave = () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("certificate", selectedFile);

      const { success, message } = await uploadCertificate(formData);

      if (!success) {
        toast.error(message ?? "Failed to upload certificate.");
        return;
      }

      toast.success(message ?? "Certificate uploaded successfully.");
      if (previewDataUrl) {
        setDisplayCertificateUrl(previewDataUrl);
      }
      setOpen(false);
      resetSelection();
    });
  };

  const getFileExtension = (filename: string | null | undefined) => {
    if (!filename) return "";
    return filename.split(".").pop()?.toUpperCase() || "";
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div className="relative inline-block w-full">
        <Card className="mt-2 border-2 border-dashed border-gray-300">
          <CardContent className="flex h-32 items-center justify-center">
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" disabled={isPending}>
                <Upload className="h-4 w-4" />
                {isPending ? "Uploading..." : "Upload Certificate"}
              </Button>
            </DialogTrigger>
          </CardContent>
        </Card>

        {displayCertificateUrl && (
          <div className="mt-2 text-sm text-gray-500">
            Current file: {getFileExtension(certificateUrl) || "Uploaded file"}
          </div>
        )}
      </div>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Certificate</DialogTitle>
          <DialogDescription>
            Choose a PDF, JPG, PNG, DOC, or DOCX file that is no larger than
            2MB.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex justify-center">
            <div className="bg-muted relative h-40 w-40 overflow-hidden rounded-lg border">
              {previewDataUrl ? (
                <Image
                  src={previewDataUrl}
                  alt="Certificate preview"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              ) : displayCertificateUrl ? (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm font-medium">
                    {getFileExtension(certificateUrl) || "File"}
                  </span>
                </div>
              ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
                  No file selected
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="certificate-input">Upload file</Label>
            <Input
              ref={fileInputRef}
              id="certificate-input"
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={handleFileChange}
            />
            <p className="text-muted-foreground text-xs">
              Maximum size 2MB. Accepted formats: PDF, JPG, PNG, DOC, DOCX.
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={resetSelection}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending || !selectedFile}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { FileUpload } from "@/registry/kit/ui/file-upload";

export default function FileUploadDemo() {
  return (
    <div className="grid w-full max-w-lg gap-8">
      <FileUpload
        accept="image/*,.pdf"
        maxFiles={5}
        maxSize={20 * 1024 * 1024}
        label="Drop files here or browse"
        hint="Images or PDFs, up to 5 files, 20 MB each"
        defaultItems={[{ name: "brand-guidelines.pdf", size: 2_481_311, type: "application/pdf" }]}
      />
      <FileUpload variant="compact" multiple={false} accept=".pdf,.doc,.docx" maxSize={8 * 1024 * 1024} label="Attach your CV" hint="PDF or DOCX, up to 8 MB" />
    </div>
  );
}

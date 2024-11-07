"use client";
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";

export default function ImageInput({
  setFile,
  photo = null,
}: {
  setFile: Dispatch<SetStateAction<File | null>>;
  photo?: string | null;
}) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const handleFileChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFile(file);
      setSelectedFile(URL.createObjectURL(file));
    }
  };

  if (photo && !selectedFile) {
    return (
      <>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor="fileInput"
          className="cursor-pointer border border-dashed border-gray-400 w-full max-w-[220px] h-[270px] flex items-center justify-center rounded-xl hover:opacity-30"
          style={{
            backgroundImage: `url(${photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}></label>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center border p-5 rounded-xl h-full">
      <span className="mb-5">Rasm yuklash</span>

      <input
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <label
        htmlFor="fileInput"
        className="cursor-pointer border border-dashed border-gray-400 w-40 h-40 flex items-center justify-center rounded-xl"
        style={{
          backgroundImage: selectedFile ? `url(${selectedFile})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        {!selectedFile && <span className="text-4xl text-gray-400">+</span>}
      </label>

      {selectedFile && <p className="mt-3">Rasm yuklandi</p>}
    </div>
  );
}

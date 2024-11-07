// components/DownloadButton.js
import React, { memo } from "react";

const DownloadButton = memo(function Button({ date }: { date: string }) {
  const handleDownload = () => {
    fetch("/api/report?date=" + date)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "attendance_report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      })
      .catch((error) => console.error("Ошибка при скачивании файла:", error));
  };

  return (
    <button className="btn btn-success text-white" onClick={handleDownload}>
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="24px"
        width="24px"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.859 2.877l12.57-1.795a.5.5 0 01.571.494v20.848a.5.5 0 01-.57.494L2.858 21.123a1 1 0 01-.859-.99V3.867a1 1 0 01.859-.99zM4 4.735v14.53l10 1.429V3.306L4 4.735zM17 19h3V5h-3V3h4a1 1 0 011 1v16a1 1 0 01-1 1h-4v-2zm-6.8-7l2.8 4h-2.4L9 13.714 7.4 16H5l2.8-4L5 8h2.4L9 10.286 10.6 8H13l-2.8 4z"
          stroke="none"
        />
      </svg>
      <span>Davomat</span>
    </button>
  );
});

export default DownloadButton;

import React from "react";

export default function Loader() {
  return (
    <dialog id="loader" className="modal backdrop-blur-lg" open>
      <div className="flex justify-center">
        <span
          className="loading loading-ring loading-lg bg-white"
          style={{ zoom: 2 }}></span>
      </div>
    </dialog>
  );
}

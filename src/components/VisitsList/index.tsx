import { Visit } from "@/types";
import React from "react";

export default function VisitsList({
  data,
  loading,
}: {
  data: Visit[] | undefined;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div key="loader" className="w-full flex justify-center">
        <span
          className="loading loading-ring loading-lg bg-white"
          style={{ zoom: 2 }}></span>
      </div>
    );
  }
  return (
    <div>
      <table className="table table-lg ">
        <thead>
          <tr className="text-xl text-primary-content border-primary-content">
            <th></th>
            <th>Xodim</th>
            <th className="text-center">Vaqt</th>
            <th className="text-center">Bo'lim</th>
            <th className="text-center">Status</th>
            <th className="text-end">Rasm</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map(
              (
                {
                  _id,
                  userName,
                  sectionName,
                  timestamp,
                  userPhoto,
                  visitPhoto,
                  status,
                },
                index
              ) => (
                <tr key={_id} className="border-primary-content">
                  <th>{index + 1}</th>
                  <td className="text-2xl text-primary-content">{userName}</td>
                  <td className="text-2xl text-primary-content text-center">
                    {timestamp}
                  </td>
                  <td className="text-2xl text-primary-content text-center">
                    {sectionName}
                  </td>
                  {status === "checkin" ? (
                    <td className="text-2xl text-primary-content text-center  ">
                      <span className="bg-success p-3">Kirish</span>
                    </td>
                  ) : (
                    <td className="text-2xl text-primary-content text-center ">
                      <span className="bg-info p-3">Chiqish</span>
                    </td>
                  )}

                  <td className="flex items-center justify-end gap-3">
                    {visitPhoto !== "None" && (
                      <img
                        src={visitPhoto}
                        alt="visit"
                        className="w-16 h-16 "
                      />
                    )}
                    <img
                      key={1}
                      src={userPhoto}
                      alt="user"
                      className="w-16 h-w-16 rounded-full"
                    />
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
}

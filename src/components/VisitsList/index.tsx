import { Visit } from "@/types";
import React from "react";

export default function VisitsList({ data }: { data: Visit[] }) {
  return (
    <div>
      <table className="table table-lg ">
        <thead>
          <tr className="text-xl text-primary-content border-primary-content">
            <th></th>
            <th>Xodim</th>
            <th className="text-center">Vaqt</th>
            <th className="text-center">Bo'lim</th>
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
                  <td className="flex items-center justify-end gap-3">
                    <img
                      src={userPhoto}
                      alt="user"
                      className="w-10 h-10 rounded-full"
                    />
                    <img
                      src={visitPhoto}
                      alt="visit"
                      className="w-10 h-10 rounded-full"
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

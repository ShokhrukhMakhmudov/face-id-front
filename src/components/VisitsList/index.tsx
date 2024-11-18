import { Visit } from "@/types";
import Link from "next/link";
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
                      <Link
                        href={visitPhoto}
                        target="blank"
                        className="hover:text-primary">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 576 512"
                          height="40"
                          width="40"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v48H54a6 6 0 00-6 6v244a6 6 0 006 6h372a6 6 0 006-6v-10h48zm42-336H150a6 6 0 00-6 6v244a6 6 0 006 6h372a6 6 0 006-6V86a6 6 0 00-6-6zm6-48c26.51 0 48 21.49 48 48v256c0 26.51-21.49 48-48 48H144c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h384zM264 144c0 22.091-17.909 40-40 40s-40-17.909-40-40 17.909-40 40-40 40 17.909 40 40zm-72 96l39.515-39.515c4.686-4.686 12.284-4.686 16.971 0L288 240l103.515-103.515c4.686-4.686 12.284-4.686 16.971 0L480 208v80H192v-48z"
                            stroke="none"
                          />
                        </svg>
                      </Link>
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

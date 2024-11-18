"use client";
import VisitsList from "@/components/VisitsList";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";
import { fetchUsersAndSections, fetchVisits } from "../../../lib/queries";
import { Visit } from "@/types";
import DownloadButton from "@/components/DownloadButton";

export default function Home() {
  const [filteredData, setFilteredData] = useState<Visit[] | null>(null);
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const { data: visits, isLoading: visitsLoading } = useQuery({
    queryKey: ["visits", date],
    queryFn: () => fetchVisits(date),
    select: (data) =>
      (data.visits as Visit[]).sort(function (a, b) {
        const da = new Date(a.timestamp).getTime();
        const db = new Date(b.timestamp).getTime();

        return da < db ? 1 : da > db ? -1 : 0;
      }),
    refetchIntervalInBackground: true,
    refetchInterval: 1000 * 60,
  });

  useEffect(() => handleSearch(search), [visits]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();

    return handleSearch(search);
  };

  const handleSearch = (searchValue: string) => {
    const value = searchValue.trim().toLowerCase();

    if (value && visits) {
      setFilteredData(
        visits?.filter((visit) => visit.userName.toLowerCase().includes(value))
      );
    } else {
      setFilteredData(null);
    }
  };

  return (
    <>
      <section className="container mt-10">
        <div className="flex justify-between">
          <form className="flex gap-2" onSubmit={handleSearchSubmit}>
            <label className="input input-bordered min-w-full max-w-[400px] flex items-center gap-2">
              <input
                name="search"
                type="text"
                className="grow"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <button className="btn btn-primary text-white" type="submit">
              Qidiruv
            </button>
          </form>
          <label className="input input-bordered w-full max-w-[200px] flex items-center gap-2">
            <input
              type="date"
              className="grow"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <div className="flex items-center gap-3">
            <DownloadButton
              date={date}
              disabled={!!visits?.length}
              label={"Safda"}
            />
            <DownloadButton
              date={date}
              disabled={!!visits?.length}
              type={"attendance"}
            />
          </div>
        </div>
        <VisitsList
          data={filteredData ? filteredData : visits}
          loading={visitsLoading}
        />
      </section>
    </>
  );
}

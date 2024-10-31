"use client";
import VisitsList from "@/components/VisitsList";
import { useQuery } from "@tanstack/react-query";
import { error } from "console";

async function fetchUsersAndSections() {
  const [users, sections, error] = await Promise.all([
    fetch("/api/staff").then((res) => res.json()),
    fetch("/api/section").then((res) => res.json()),
    { error: false },
  ]).catch((error) => [{}, {}, { error: true, message: "Xatolik yuz berdi!" }]);
  return { users, sections, error };
}

async function fetchVisits() {
  return await fetch("/api/visits").then((res) => res.json());
}
export default function page() {
  const { data: usersAndSections, isLoading: usersAndSectionsLoading } =
    useQuery({
      queryKey: ["usersAndSections"],
      queryFn: fetchUsersAndSections,
    });

  const { data: visits, isLoading: visitsLoading } = useQuery({
    queryKey: ["visits"],
    queryFn: fetchVisits,
    select: (data) => data.visits,
    refetchIntervalInBackground: true,
    refetchInterval: 1000 * 60,
  });

  return (
    <>
      <section className="container mt-10">
        <h2 className="object-cover">HOME</h2>
        {visits && <VisitsList data={visits} />}
      </section>
    </>
  );
}

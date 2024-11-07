export async function fetchUsersAndSections() {
  const [users, sections, error] = await Promise.all([
    fetch("/api/staff").then((res) => res.json()),
    fetch("/api/section").then((res) => res.json()),
    { error: false },
  ]).catch((error) => [{}, {}, { error: true, message: "Xatolik yuz berdi!" }]);
  return { users, sections, error };
}

export async function fetchVisits(date: string) {
  return await fetch("/api/visits" + `?date=${date}`).then((res) => res.json());
}

"use client";
import Loader from "@/components/Loader";
import { Section, User } from "@/types";
import Link from "next/link";
import { FormEvent, MouseEvent, useEffect, useState } from "react";

export default function page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [staff, setStaff] = useState<[] | User[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<[] | User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sections, setSections] = useState<null | { [key: string]: string }>(
    null
  );
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    async function fetchSections() {
      try {
        const response = await fetch("/api/section");
        const result = await response.json();

        const obj: { [key: string]: string } = {};

        result.sections.forEach((section: Section) => {
          obj[section._id] = section.name;
        });
        setSections({ ...obj });
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    }
    fetchSections();
    async function fetchStaff() {
      try {
        const response = await fetch("/api/staff");
        const result = await response.json();
        setStaff(result.staff);
        setFilteredStaff(result.staff);
      } catch (error) {
        console.error("Error fetching Staff:", error);
      }
    }
    fetchStaff();

    setLoading(false);
  }, [refresh]);

  function openDeleteModal(userId: string, userName: string) {
    (
      document.getElementById("userDeleteModalBtn") as HTMLButtonElement
    ).setAttribute("data-id", userId);
    (
      document.getElementById("userDeleteModalTitle") as HTMLElement
    ).textContent = `${userName}`;

    (document.getElementById("userDeleteModal") as HTMLDialogElement)
      ?.closest("dialog")
      ?.showModal();
  }

  async function deleteUser(event: MouseEvent) {
    const userId = (event.target as HTMLButtonElement).dataset.id;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8088/user/delete", {
        method: "PUT",
        body: JSON.stringify({ id: userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result?.success) {
        alert("Xodim muvaffaqiyatli o'chirildi");
        setRefresh(!refresh);
      } else {
        throw new Error(result?.message);
      }
    } catch (error) {
      alert("O'chirishda xatolik yuz berdi!");
    }
    setLoading(false);
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const searchText = search.toLowerCase().trim();
    if (searchText === "") {
      return setFilteredStaff(staff);
    }

    const filtered = (staff as User[]).filter(({ name, lastname }) =>
      `${lastname + " " + name}`.toLowerCase().includes(searchText)
    );
    setFilteredStaff(filtered);
  }

  function handleSearchReset() {
    setSearch("");
    setFilteredStaff(staff);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <section className="mt-3">
        <div className="container">
          <h2 className="text-xl md:text-3xl text-center bg-primary py-2 text-white font-semibold uppercase rounded-b-2xl mb-5">
            Xodimlar
          </h2>
          <form className="flex gap-2" onSubmit={handleSearchSubmit}>
            <label className="input input-bordered w-[700px] flex items-center gap-2">
              <input
                name="search"
                type="text"
                className="grow"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={staff ? false : true}
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

            <button
              className="btn btn-primary text-white text-lg"
              type="submit"
              disabled={staff ? false : true}>
              Qidiruv
            </button>
            {search && (
              <button
                className="btn btn-error text-white text-lg"
                onClick={handleSearchReset}
                disabled={staff ? false : true}>
                Tozalash
              </button>
            )}
          </form>
          <table className="table table-lg ">
            <thead>
              <tr className="text-xl text-primary-content border-primary-content">
                <th></th>
                <th>Xodim</th>
                <th className="text-center">Bo'lim</th>
                <th className="text-end">
                  <Link
                    href="/dashboard/staff/create"
                    className="btn font-semibold btn-primary text-white">
                    <span>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"></path>
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                      </svg>
                    </span>
                    Xodim qo'shish
                  </Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length ? (
                filteredStaff.map(
                  ({ _id, name, lastname, sectionId, photo }, index) => (
                    <tr key={_id} className="border-primary-content">
                      <th>{index + 1}</th>
                      <td className="text-2xl text-primary-content">
                        {lastname + " " + name}
                      </td>
                      <td className="text-2xl text-primary-content text-center">
                        {sections && sections[sectionId]}
                      </td>
                      <td className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/staff/edit/${_id.toString()}`}
                          className="btn btn-ghost flex items-center gap-2 text-lg font-semibold text-primary-content"
                          onClick={() => {}}>
                          <span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 24 24"
                              height="20"
                              width="20"
                              xmlns="http://www.w3.org/2000/svg">
                              <g id="Edit">
                                <g>
                                  <path d="M3.548,20.938h16.9a.5.5,0,0,0,0-1H3.548a.5.5,0,0,0,0,1Z"></path>
                                  <path d="M9.71,17.18a2.587,2.587,0,0,0,1.12-.65l9.54-9.54a1.75,1.75,0,0,0,0-2.47l-.94-.93a1.788,1.788,0,0,0-2.47,0L7.42,13.12a2.473,2.473,0,0,0-.64,1.12L6.04,17a.737.737,0,0,0,.19.72.767.767,0,0,0,.53.22Zm.41-1.36a1.468,1.468,0,0,1-.67.39l-.97.26-1-1,.26-.97a1.521,1.521,0,0,1,.39-.67l.38-.37,1.99,1.99Zm1.09-1.08L9.22,12.75l6.73-6.73,1.99,1.99Zm8.45-8.45L18.65,7.3,16.66,5.31l1.01-1.02a.748.748,0,0,1,1.06,0l.93.94A.754.754,0,0,1,19.66,6.29Z"></path>
                                </g>
                              </g>
                            </svg>
                          </span>
                          Tahrirlash
                        </Link>
                        <button
                          className="btn btn-ghost flex items-center gap-2  text-lg font-semibold text-primary-content"
                          onClick={() =>
                            openDeleteModal(
                              _id.toString(),
                              lastname + " " + name
                            )
                          }>
                          <span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 16 16"
                              height="20"
                              width="20"
                              xmlns="http://www.w3.org/2000/svg">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
                            </svg>
                          </span>
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <th>
                    <h2 className="w-full text-start text-primary-content text-2xl">
                      Ma'lumot topilmadi!
                    </h2>
                  </th>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <dialog className="modal text-primary-content" id="userDeleteModal">
        <div className="modal-box">
          <h3 className="text-2xl font-bold">Xodimni o'chirish!</h3>
          <p
            id="userDeleteModalTitle"
            className="text-2xl py-4 font-semibold text-primary"></p>
          <p className="text-xl mb-5">
            Ushbu xodimdi o'chirishga ishonchingiz komilmi?
          </p>
          <div className="flex items-center gap-3 justify-end">
            <button
              id="userDeleteModalBtn"
              className="btn btn-success text-white text-xl"
              onClick={deleteUser}>
              Xa
            </button>
            <button
              className="btn btn-error text-white text-xl"
              onClick={() =>
                (
                  document.getElementById(
                    "userDeleteModal"
                  ) as HTMLDialogElement
                )
                  .closest("dialog")
                  ?.close()
              }>
              Yo'q
            </button>
          </div>
        </div>
        <button
          className="modal-backdrop"
          onClick={() =>
            (document.getElementById("userDeleteModal") as HTMLDialogElement)
              .closest("dialog")
              ?.close()
          }></button>
      </dialog>
    </>
  );
}

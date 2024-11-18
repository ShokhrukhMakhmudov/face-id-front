"use client";
import Loader from "@/components/Loader";
import { Section } from "@/types";
import { set } from "mongoose";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function page() {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [sections, setSections] = useState<null | Section[]>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    async function fetchSections() {
      try {
        const response = await fetch("/api/section");
        const result = await response.json();
        setSections(result.sections);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    }
    fetchSections();
    setLoading(false);
  }, [refresh]);

  // Обработчик изменения значений полей формы
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/section/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Bo'lim muvaffaqiyatli qo'shildi!");
        window.location.reload();
      } else {
        setError("Xatolik: " + result.message);
      }
    } catch (error) {
      setError("Malumotlarni saqlashda xatolik yuz berdi.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);

    try {
      const response = await fetch("/api/section/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (result?.success) {
        alert("Bo'lim muvaffaqiyatli o'chirildi!");
        window.location.reload();
      } else {
        setError("Xatolik: " + result.error);
      }
    } catch (error) {
      setError("Malumotlarni saqlashda xatolik yuz berdi.");
    }

    setLoading(false);
  };

  const handleEdit = (id: string, name: string) => {
    (document.getElementById("editName") as HTMLInputElement).dataset.id = id;
    (document.getElementById("editName") as HTMLInputElement).value = name;

    (
      document.getElementById("SectionEditModal") as HTMLDialogElement
    ).showModal();
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem(
      "editName"
    ) as HTMLInputElement;

    const [name, id] = [input.value, input.dataset.id];

    setLoading(true);

    try {
      const response = await fetch("/api/section/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Bo'lim muvaffaqiyatli o'zgartirildi!");
        setRefresh((prev) => !prev);
      } else {
        setError("Xatolik: " + result.message);
      }
    } catch (error) {
      setError("Malumotlarni saqlashda xatolik yuz berdi.");
    }

    document.getElementById("SectionEditModal")?.closest("dialog")?.close();

    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <section className="mt-3">
        <div className="container">
          <h2 className="text-xl md:text-3xl text-center bg-primary py-2 text-white font-semibold uppercase rounded-b-2xl">
            Bo'limlar
          </h2>
          <form
            className="card-body max-w-[700px] mx-auto"
            onSubmit={handleSubmit}>
            <div className="form-control">
              <div className="flex sm:flex-row flex-col items-center gap-10">
                <div className="w-full">
                  <label className="label">
                    <span className="label-text text-lg">Bo'lim nomi</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Bo'lim nomi..."
                    className="input input-bordered text-xl w-full"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="form-control mt-3">
              <button className="btn btn-primary text-white text-lg">
                Qo'shish
              </button>
            </div>
          </form>

          <table className="table table-lg">
            <thead>
              <tr className="text-2xl text-primary-content border-primary-content">
                <th></th>
                <th>Nomi</th>
                <th className="text-end">Tahrir/O'chirish</th>
              </tr>
            </thead>
            <tbody>
              {sections &&
                sections.map((section, index) => (
                  <tr key={section._id} className="border-primary-content">
                    <th>{index + 1}</th>
                    <td className="text-2xl text-primary-content">
                      {section.name}
                    </td>
                    <td className="flex items-center justify-end gap-3">
                      <button
                        className="btn btn-outline flex items-center gap-2 text-primary-content text-lg font-semibold"
                        onClick={() => handleEdit(section._id, section.name)}>
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
                      </button>
                      <button
                        className="btn btn-outline flex items-center gap-2 text-primary-content text-lg font-semibold"
                        onClick={() => handleDelete(section._id)}>
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
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <dialog id="SectionEditModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form
            className="card-body max-w-[700px] mx-auto"
            onSubmit={handleEditSubmit}>
            <div className="form-control">
              <div className="flex sm:flex-row flex-col items-center gap-10">
                <div className="w-full">
                  <label className="label">
                    <span className="label-text text-lg">
                      Bo'lim yangi nomi
                    </span>
                  </label>
                  <input
                    type="text"
                    id="editName"
                    placeholder="Bo'lim nomi..."
                    className="input input-bordered text-xl w-full"
                    required
                  />
                </div>
              </div>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="form-control mt-3">
              <button className="btn btn-primary text-white text-lg">
                O'zgatirish
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

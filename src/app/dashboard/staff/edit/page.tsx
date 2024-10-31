"use client";
import ImageInput from "@/components/ImageInput";
import { Section } from "@/types";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function page() {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    section: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [sections, setSections] = useState<null | Section[]>(null);

  const router = useRouter();

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
  }, []);

  // Обработчик изменения значений полей формы
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!file) {
      setError("Rasm yuklash kerak");
      setLoading(false);
      return;
    }

    const sendData = new FormData();
    sendData.append("file", file);
    sendData.append("name", formData.name);
    sendData.append("lastname", formData.lastname);
    sendData.append("section", formData.section);

    try {
      const response = await fetch("http://localhost:8088/user/add", {
        method: "POST",
        body: sendData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Bitiruvchi muvaffaqiyatli qo'shildi!");
      } else {
        setError("Xatolik: " + result.message);
      }
    } catch (error) {
      setError("Malumotlarni saqlashda xatolik yuz berdi.");
    }
    setLoading(false);
  };

  return (
    <section className="mt-3">
      <div className="container">
        <h2 className="text-xl md:text-3xl text-center bg-primary py-2 text-white font-semibold uppercase rounded-b-2xl">
          Xodim qo'shish
        </h2>
        <form
          className="card-body max-w-[700px] mx-auto"
          onSubmit={handleSubmit}>
          <div className="form-control">
            <div className="flex sm:flex-row flex-col items-center gap-10">
              <ImageInput setFile={setFile} />
              <div className="w-full">
                <label className="label">
                  <span className="label-text text-lg">Familiya</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Familiya"
                  className="input input-bordered text-xl w-full"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
                <label className="label">
                  <span className="label-text text-lg">Ism</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ism"
                  className="w-full input input-bordered text-xl"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label className="label">
                  <span className="label-text text-lg">Bo'lim</span>
                </label>
                <select
                  name="section"
                  className="select select-bordered w-full text-xl text-primary-content"
                  disabled={!sections ? true : false}
                  required
                  onChange={handleChange}
                  value={formData.section}>
                  <option value="">Bo'limni tanlang</option>
                  {sections &&
                    sections?.map((section) => (
                      <option key={section._id} value={section._id}>
                        {section.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="form-control mt-6">
            <button className="btn btn-primary text-white text-lg">
              Qo'shish
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

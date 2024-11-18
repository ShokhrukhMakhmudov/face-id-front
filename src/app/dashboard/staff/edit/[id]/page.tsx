"use client";
import ImageInput from "@/components/ImageInput";
import Loader from "@/components/Loader";
import { Section, User } from "@/types";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [initialData, setInitialData] = useState<null | User>(null);
  const [formData, setFormData] = useState<User>({
    _id: "",
    name: "",
    lastname: "",
    sectionId: "",
    photo: "",
  });
  console.log(formData);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [sections, setSections] = useState<null | Section[]>(null);
  console.log(file);

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

    async function fetchUser() {
      try {
        const response = await fetch(`/api/staff/member?id=${id}`);
        const result = await response.json();
        if (!result.success) {
          alert("Foydalanuvchi topilmadi");
          router.push("/dashboard/staff");
        }
        setFormData(result.user);
        setInitialData(result.user);
      } catch (error) {
        console.error("Error fetching Staff:", error);
      }
    }
    fetchUser();

    setLoading(false);
  }, [id]);

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

    // Определяем, какие данные изменились
    const sendData = new FormData();

    if (formData.name !== initialData?.name)
      sendData.append("name", formData.name);
    if (formData.lastname !== initialData?.lastname)
      sendData.append("lastname", formData.lastname);
    if (formData.sectionId !== initialData?.sectionId)
      sendData.append("sectionId", formData.sectionId);
    if (file) sendData.append("file", file);
    setLoading(false);

    if (sendData.entries().next().done) {
      alert("O'zgartirilgan ma'lumotlar mavjud emas!");
      setLoading(false);
      return;
    }

    try {
      sendData.append("_id", formData._id);
      const response = await fetch("http://localhost:8088/user/update", {
        method: "PUT",
        body: sendData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Ma'lumotlar muvaffaqiyatli o'zgartirildi!");
      } else {
        setError("Xatolik: " + result.error);
      }
    } catch (error) {
      setError("Malumotlarni saqlashda xatolik yuz berdi.");
    }
    setLoading(false);

    router.push("/dashboard/staff");
  };

  if (loading) {
    return <Loader />;
  }

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
              <ImageInput setFile={setFile} photo={formData.photo} />
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
                  name="sectionId"
                  className="select select-bordered w-full text-xl text-primary-content"
                  disabled={!sections ? true : false}
                  required
                  onChange={handleChange}
                  value={formData?.sectionId}>
                  <option value="">Bo'limni tanlang</option>
                  {sections &&
                    sections?.map((section) => (
                      <option key={section._id} value={section._id.toString()}>
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
              O'zgartirish
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

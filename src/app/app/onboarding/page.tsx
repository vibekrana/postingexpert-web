"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    brandName: "",
    businessType: "",
    description: "",
    audience: "",
    tone: "",
    visualStyle: "",
    colors: ["#E8F1F2", "#C4D9FF"],
    postTime: "10:00",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      alert("Please login again");
      return;
    }

    await fetch(
      "https://4fqbpp1yya.execute-api.ap-south-1.amazonaws.com/prod/user/onboarding",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          brand: form,
        }),
      }
    );

    router.push("/app/dashboard");
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Set up your brand</h1>
      <p className="mt-2 text-muted-foreground">
        This helps our AI understand your business. You do this once.
      </p>

      <div className="mt-10 space-y-6">
        <input
          name="brandName"
          placeholder="Brand name"
          className="input"
          onChange={handleChange}
        />

        <select name="businessType" className="input" onChange={handleChange}>
          <option value="">Select industry</option>
          <option>Technology</option>
          <option>Education</option>
          <option>Finance</option>
          <option>Healthcare</option>
          <option>Ecommerce</option>
          <option>Restaurant</option>
          <option>Other</option>
        </select>

        <textarea
          name="description"
          placeholder="What does your business do?"
          className="input h-28"
          onChange={handleChange}
        />

        <input
          name="audience"
          placeholder="Target audience"
          className="input"
          onChange={handleChange}
        />

        <input
          name="tone"
          placeholder="Brand tone (e.g. professional, friendly)"
          className="input"
          onChange={handleChange}
        />

        <input
          name="visualStyle"
          placeholder="Visual style (e.g. minimal, modern)"
          className="input"
          onChange={handleChange}
        />

        <div>
          <label className="text-sm">Daily posting time</label>
          <input
            type="time"
            name="postTime"
            className="input"
            value={form.postTime}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={submit}
          className="mt-6 w-full rounded-xl bg-primary px-6 py-3 text-white"
        >
          Finish setup
        </button>
      </div>
    </main>
  );
}

import React, { useState } from "react";
import axiosInstance from "../../config/apiConfig";
import { toast } from "react-toastify";

const SubscribeToNewsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/newsletter/subscribe", {
        email
      });

      toast.success("Subscribed to newsletter successfully!");
      setEmail("");
      console.log("newsletter subscription response --->", response.data);
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Subscription failed");
    }
  };

  return (
    <section className="w-full h-[425.763px] flex justify-center bg-[rgb(23,23,23)]">
      <div className="w-[1520.8px] px-[76px] py-[80px] rounded-[24px] text-center relative">

        <div className="max-w-[858px] mx-auto flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[37px] font-extrabold leading-[44.16px] text-white">
              Subscribe to Our Newsletter
            </h2>
          </div>

          <p className="text-[16px] text-[rgb(136,136,136)]">
            Get the latest updates from The Digital Economist
          </p>
        </div>

        <div className="mt-[48px] flex justify-center">
          <div className="w-[520px]">
            <form onSubmit={handleSubmit} className="flex items-center gap-[8px] w-[520px] h-[48px]">
              
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your Email"
                className="bg-white border text-black font-semibold rounded text-[16px] w-[369px] h-[48px] px-[16px]"
              />

              <button
                type="submit"
                className="bg-[rgb(16,90,189)] text-white w-[142px] h-[38px] rounded"
              >
                Subscribe now
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeToNewsletter;

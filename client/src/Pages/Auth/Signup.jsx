import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import axiosInstance from "../../config/apiConfig.js";
import Step1 from "../../components/Auth/Step1.jsx";
import Step2 from "../../components/Auth/Step2.jsx";
import Step3 from "../../components/Auth/Step3.jsx";

const sampleUser = {
  FullName: "",
  email: "",
  password: "",
  role: "",
  socialLinks: {
    twitter: "",
    LinkedIn: "",
    Instagram: "",
  },
  followedTopics: [],
  isSubscribedToNewsletter: false,
  location: "",
  title: "",
  department: "",
  company: "",
  expertise: [],
  discoverySource: "",
};

const Signup = () => {
  const methods = useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(sampleUser);
  const [stepValid, setStepValid] = useState(false);
  const [triedToContinue, setTriedToContinue] = useState(false);
  const navigate = useNavigate();

  const next = () => {
    if (stepValid) {
      setStep((s) => s + 1);
      setTriedToContinue(false); // reset warning
    } else {
      setTriedToContinue(true);
    }
  };

  const prev = () => setStep((s) => s - 1);

  /* Submitting all of the information to the backend */
  const onSubmit = async(e) =>{
    e.preventDefault();
    try{
        const { socialLinks, ...rest } = userData;
        const finalData = {
          ...rest,
          socialLinks: socialLinks
        };
        const res = await axiosInstance.post("/api/user/signup", finalData);
        
        if(res.status == 200){
          await axiosInstance.post("/api/user/login", {
            email: userData.email,
            password: userData.password
          });
          navigate("/");
          toast.success("You are successfully a part of The Digital Economist Community!");
        }

    }catch(err){
        if (err.res?.status === 402) {
          toast.error("An account with this email ID already exists, please sign up with a different email!");
        } else {
          toast.error(err.response.data.msg);
          console.error("Signup error:", err);
        }
        console.log("This error occurred in frontend in signup.jsx while trying to signup ----> ", err);
    }
  }

  return (
    <FormProvider {...methods}>
  <div className="bg-black min-h-screen flex items-center justify-center px-4">
    <form
      onSubmit={onSubmit}
      className="w-full max-w-2xl text-white bg-neutral-900 shadow-md p-8 rounded-xl space-y-6 border border-blue-700 shadow-blue-700"
    >
      <h2 className="text-2xl font-semibold text-center">Signup - Step {step}</h2>

      {/* Step Sections */}
      {step === 1 && (
        <Step1
          formData={userData}
          formFunction={setUserData}
          setStepValid={setStepValid}
        />
      )}
      {step === 2 && (
        <Step2
          formData={userData}
          formFunction={setUserData}
          setStepValid={setStepValid}
        />
      )}
      {step === 3 && (
        <Step3
          formData={userData}
          formFunction={setUserData}
          setStepValid={setStepValid}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col items-end space-y-2">
        <div className="flex justify-between w-full items-center">
          {step > 1 && (
            <button
              type="button"
              onClick={prev}
              className="text-sm text-gray-300 hover:text-white transition"
            >
              ← Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={methods.handleSubmit(next)}
              disabled={loading}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition disabled:opacity-50"
            >
              Continue →
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>

        {triedToContinue && !stepValid && (
          <p className="text-sm text-red-400 text-right">
            Please fill in all required fields correctly before continuing.
          </p>
        )}
      </div>
    </form>
  </div>
</FormProvider>


  );
};

export default Signup;

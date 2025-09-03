"use client";
import { useState } from "react";

type DataFromForm = {
  mpesa_phone: string;
  name: string;
  amount: number;
};

const PaymentForm = () => {
  const [dataFromForm, setDataFromForm] = useState<DataFromForm>({
    mpesa_phone: "",
    name: "",
    amount: 0,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      mpesa_number: dataFromForm.mpesa_phone.trim(),
      name: dataFromForm.name.trim(),
      amount: dataFromForm.amount,
    };
    // console.log(formData);
    try {
      const response = await fetch(`/api/stkpush`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.error) {
        alert(`❌ Payment failed: ${data.error}`);
      } else {
        alert("✅ STK Push sent! Check your phone to complete payment.");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="lg:pl-12">
      <div className="overflow-hidden rounded-md bg-white">
        <div className="p-6 sm:p-10">
          <p className="mt-4 text-base text-gray-600">
            Provide your name, mpesa number and amount to process donation.
          </p>
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="text-base font-medium text-gray-900">
                  {" "}
                  Name{" "}
                </label>
                <div className="relative mt-2.5">
                  <input
                    type="text"
                    required
                    value={dataFromForm.name}
                    onChange={(e) =>
                      setDataFromForm({
                        ...dataFromForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="John Doe"
                    className="block w-full rounded-md border border-gray-200 bg-white px-4 py-4 text-black placeholder-gray-500 caret-orange-500 transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-900">
                  {" "}
                  Mpesa Number{" "}
                </label>
                <div className="relative mt-2.5">
                  <input
                    type="text"
                    name="mpesa_number"
                    value={dataFromForm.mpesa_phone}
                    onChange={(e) =>
                      setDataFromForm({
                        ...dataFromForm,
                        mpesa_phone: e.target.value,
                      })
                    }
                    placeholder="Enter mpesa phone number"
                    className="block w-full rounded-md border border-gray-200 bg-white px-4 py-4 text-black placeholder-gray-500 caret-orange-500 transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-900">
                  {" "}
                  Amount{" "}
                </label>
                <div className="relative mt-2.5">
                  <input
                    type="number"
                    required
                    name="amount"
                    value={dataFromForm.amount}
                    onChange={(e) =>
                      setDataFromForm({
                        ...dataFromForm,
                        amount: Number(e.target.value),
                      })
                    }
                    placeholder="Enter an active whatsapp number"
                    className="block w-full rounded-md border border-gray-200 bg-white px-4 py-4 text-black placeholder-gray-500 caret-orange-500 transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer w-full items-center justify-center rounded-md border border-transparent bg-orange-500 px-4 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-600 focus:bg-orange-600 focus:outline-none"
                >
                  Proceed With payment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;

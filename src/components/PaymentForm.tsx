"use client";
import { useState, useRef, useEffect } from "react";

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

  const [isPending, setIsPending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<
    "success" | "error" | "info" | null
  >(null);

  const pollingRef = useRef<NodeJS.Timeout>(null);
  const timeOutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (timeOutRef.current) clearTimeout(timeOutRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setStatusMessage("Sending STK request....");
    setStatusType("info");

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
        setIsPending(false);
        setStatusMessage(`Payment Failed.. ${data.error}`);
        setStatusType("error");
      }

      setStatusMessage("STK Push sent! Please check your phone...");
      setStatusType("info");

      pollingRef.current = setInterval(async () => {
        const response = await fetch("/api/mpesa/callback");
        const data = await response.json();

        if (data?.Body?.stkCallback) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          if (timeOutRef.current) clearTimeout(timeOutRef.current);

          setIsPending(false);
          const { ResultCode, ResultDesc } = data.Body.stkCallback;
          if (ResultCode === 0) {
            setStatusMessage("Payment successful!");
            setStatusType("success");
          } else {
            setStatusMessage(`Failed ${ResultDesc}`);
            setStatusType("error");
          }
        }
      }, 3000);

      timeOutRef.current = setTimeout(() => {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setIsPending(false);
        setStatusMessage("Payment took too long. Please try again.");
        setStatusType("error");
      }, 120000);
    } catch (error) {
      console.error("Error submitting payment:", error);
      setStatusMessage("Something went wrong. Please try again.");
      setStatusType("error");
      setIsPending(false);
    }
  };

  const statusStyles = {
    success: "bg-green-100 text-green-700 border border-green-300",
    error: "bg-red-100 text-red-700 border border-red-300",
    info: "bg-orange-100 text-orange-700 border border-orange-300",
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
                {statusMessage && (
                  <div
                    className={`rounded-md px-4 py-3 text-sm font-medium mb-2 ${
                      statusType ? statusStyles[statusType] : ""
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="inline-flex cursor-pointer w-full items-center justify-center rounded-md border border-transparent bg-orange-500 px-4 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-600 focus:bg-orange-600 focus:outline-none"
                  disabled={isPending}
                >
                  {isPending ? "Processing" : "Proceed With payment"}
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

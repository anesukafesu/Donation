import { DonorSelectInput, SubmitInput, TextInput, Form } from ".";
import { recordDonation } from "../lib/api";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export function RecordDonationForm() {
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [donor, setDonor] = useState(null);
  const [formActive, setFormActive] = useState(true);

  async function handleSubmit(e) {
    if (!formActive) return;
    e.preventDefault();
    if (donor && donor.label && amount) {
      confirmAlert({
        title: "Record Donation",
        message: `Are you sure you want to record a donation by ${donor.label} for NGN${amount}?`,
        buttons: [
          {
            label: "Record Donation",
            onClick: async () => {
              setFormActive(false);
              toast("Recording donation...");
              try {
                const response = await recordDonation(
                  donor.value,
                  amount,
                  date
                );
                toast(response.message);
              } catch (e) {
                toast(e.response.data.message);
              } finally {
                setAmount(0);
                setDonor(null);
                setDate("");
                setFormActive(true);
              }
            },
          },
          {
            label: "Cancel",
            onClick: () => {},
          },
        ],
      });
    } else {
      toast("Please supply both the donor and amount.");
    }
  }
  return (
    <Form onSubmit={handleSubmit}>
      <DonorSelectInput
        selectedDonor={donor}
        onChange={(selectedDonor) => {
          setDonor(selectedDonor);
        }}
      />
      <TextInput
        label="Amount"
        placeholder="Enter the donated amount"
        type="number"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
      />
      <TextInput
        label="Date (optional)"
        placeholder="Date"
        type="date"
        onChange={(e) => setDate(e.target.value)}
        value={date}
      />
      <SubmitInput label="Record donation" active={formActive} />
    </Form>
  );
}

"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import Link from "next/link";

export function ConfirmSubmitButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  const confirmSubmit = () => {
    const form = formRef.current;

    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      setIsModalOpen(false);
      return;
    }

    startTransition(async () => {
      setIsModalOpen(false);
      form.requestSubmit();
      router.push("/");
    });
  };

  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        className="bg-amber-500 w-fit m-auto p-2 mbs-3 rounded-xl border-2 border-amber-500 hover:bg-white ease-in duration-100 cursor-pointer"
        type="submit"
        onClick={(event) => {
          event.preventDefault();

          const form = event.currentTarget.form;

          if (!form) return;

          formRef.current = form;

          if (!form.checkValidity()) {
            form.reportValidity();
            return;
          }

          setIsModalOpen(true);
        }}
      >
        Submit
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmSubmit}
        isPending={isPending}
        pendingText="Saving product..."
        title="Confirm product"
      >
        Are you sure you want to submit this product?
      </Modal>
    </>
  );
}

export function CancelButton() {
  return (
    <Link
      className="bg-slate-200 w-fit m-auto p-2 mbs-3 rounded-xl border-2 border-slate-200 hover:border-slate-500 hover:bg-white ease-in duration-100 cursor-pointer"
      href="/"
    >
      Cancel
    </Link>
  );
}

"use client";
import { useState } from "react";
import Modal from "./Modal";
import useMountTransition from "@/hooks/useMountTransition";
import { BsInfoCircle } from "react-icons/bs";
import { logout } from "@/actions/auth";

export default function LogoutBtn() {
  const [open, setOpen] = useState(false);
  const hasTransitionedIn = useMountTransition(open);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="w-full transition-esae-300 py-2.5 bg-red-600 rounded-lg hover:bg-red-700 hover:text-white"
      >
        خارج شدن
      </button>

      {(open || hasTransitionedIn) && (
        <Modal show={hasTransitionedIn && open} onClose={() => setOpen(false)}>
          <div className="grid-center">
            <BsInfoCircle className="text-8xl" />
          </div>
          <h2 className="text-center text-2xl my-7">
            ایا از خروج اطمینان دارین ؟
          </h2>

          <div className="flex-align-center gap-x-3 [&>*]:flex-1">
            <button
              onClick={async () => await logout()}
              type="button"
              className="w-full bg-primary py-2 rounded-lg"
            >
              بله
            </button>

            <button
              onClick={() => setOpen(false)}
              type="button"
              className="bg-gray-600 hover:bg-gray-500 py-2 rounded-lg"
            >
              خیر
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

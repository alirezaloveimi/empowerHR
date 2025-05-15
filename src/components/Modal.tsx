"use client";

import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";

type ModalProps = PropsWithChildren & {
  show: boolean;
  onClose(): void;
};

export default function Modal({ onClose, show, children }: ModalProps) {
  return createPortal(
    <div
      className={`flex-center fixed inset-0 z-50 transition duration-300 ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div onClick={onClose} className="fixed inset-0 bg-black/60"></div>
      <div
        className={`p-4 bg-secondary w-[90%] max-w-[500px] transition duration-300 space-y-4 rounded-xl ${
          show ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex-center-between">
          <button onClick={onClose} type="button">
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        <div className="">{children}</div>
      </div>
    </div>,
    document.getElementById("portal-wrapper")!
  );
}

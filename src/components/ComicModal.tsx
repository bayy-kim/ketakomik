"use client";

import { useState } from "react";
import { X, AlertCircle, Info, CheckCircle2 } from "lucide-react";

interface ComicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "info" | "warning" | "success" | "confirm";
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ComicModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  onConfirm,
  confirmText = "YA, LANJUTKAN",
  cancelText = "BATAL",
}: ComicModalProps) {
  if (!isOpen) return null;

  const bgHeader =
    type === "warning"
      ? "bg-comic-bayangan text-white"
      : type === "success"
      ? "bg-emerald-500 text-white"
      : "bg-comic-yellow text-comic-ink";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-comic-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white comic-border rounded-xl comic-shadow-lg max-w-md w-full p-5 flex flex-col gap-4 relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 comic-border-sm text-comic-ink"
        >
          <X className="w-4 h-4" />
        </button>

        <div className={`p-3 rounded-lg comic-border-sm flex items-center gap-2.5 ${bgHeader}`}>
          {type === "warning" ? (
            <AlertCircle className="w-6 h-6 shrink-0" />
          ) : type === "success" ? (
            <CheckCircle2 className="w-6 h-6 shrink-0" />
          ) : (
            <Info className="w-6 h-6 shrink-0" />
          )}
          <h3 className="font-bangers text-xl tracking-wide">{title}</h3>
        </div>

        <p className="font-sans text-sm text-gray-800 leading-relaxed">{message}</p>

        <div className="flex gap-2 justify-end mt-2">
          {type === "confirm" ? (
            <>
              <button
                onClick={onClose}
                className="comic-btn text-xs bg-gray-200 hover:bg-gray-300 text-comic-ink px-4 py-2"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
                className="comic-btn text-xs bg-comic-yellow hover:bg-yellow-400 text-comic-ink px-4 py-2"
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="comic-btn text-xs bg-comic-yellow hover:bg-yellow-400 text-comic-ink px-5 py-2"
            >
              OK, MENGERTI!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

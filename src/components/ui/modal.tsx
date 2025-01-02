"use client";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-[#231C32] text-white rounded-full"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

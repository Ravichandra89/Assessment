// src/hooks/use-toast.ts
import { useState, useCallback } from "react";
import type { ToastProps, ToastActionElement } from "./toast.tsx";

type ToastItem = ToastProps & {
  id: string;
  action?: ToastActionElement;
  duration?: number;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((options: ToastItem) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...options, id }]);
    // automatically remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, options.duration || 4000);
  }, []);

  return { toast, toasts };
}

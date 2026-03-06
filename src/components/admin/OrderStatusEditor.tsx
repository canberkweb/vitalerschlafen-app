"use client";

import { useActionState } from "react";
import { updateOrderStatusAction, type UpdateOrderStatusState } from "@/actions/orders";
import { ADMIN_UPDATABLE_STATUSES } from "@/lib/validations/order";
import { Check, AlertCircle } from "lucide-react";

interface OrderStatusEditorProps {
  orderId: string;
  currentStatus: string;
  currentTrackingNumber: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  PREPARING: "In Vorbereitung",
  SHIPPED: "Versandt",
  DELIVERED: "Zugestellt",
  CANCELLED: "Storniert",
  REFUNDED: "Erstattet",
};

const initialState: UpdateOrderStatusState = {};

export function OrderStatusEditor({
  orderId,
  currentStatus,
  currentTrackingNumber,
}: OrderStatusEditorProps) {
  const [state, formAction, pending] = useActionState(updateOrderStatusAction, initialState);

  // Only show editor for actionable statuses
  const canUpdate =
    currentStatus === "PAID" ||
    currentStatus === "PREPARING" ||
    currentStatus === "SHIPPED" ||
    currentStatus === "MANUAL_REVIEW";

  if (!canUpdate) {
    return (
      <p className="text-xs text-brand-neutral">
        Status kann nicht mehr geändert werden.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="orderId" value={orderId} />

      <div>
        <label htmlFor={`status-${orderId}`} className="mb-1 block text-xs font-medium text-brand-neutral">
          Neuer Status
        </label>
        <select
          id={`status-${orderId}`}
          name="status"
          defaultValue=""
          className="rounded-lg border border-brand-neutral-light/40 bg-white px-3 py-1.5 text-xs text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        >
          <option value="" disabled>
            Auswählen…
          </option>
          {ADMIN_UPDATABLE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s] ?? s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`tracking-${orderId}`} className="mb-1 block text-xs font-medium text-brand-neutral">
          Sendungsnummer
        </label>
        <input
          id={`tracking-${orderId}`}
          name="trackingNumber"
          type="text"
          defaultValue={currentTrackingNumber ?? ""}
          placeholder="Optional"
          className="w-48 rounded-lg border border-brand-neutral-light/40 bg-white px-3 py-1.5 text-xs text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-1.5 rounded-lg bg-brand-dark px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-dark-soft disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Speichern…" : "Aktualisieren"}
      </button>

      {/* Feedback */}
      {state.orderId === orderId && state.success && (
        <span className="flex items-center gap-1 text-xs text-brand-success">
          <Check className="h-3 w-3" /> Gespeichert
        </span>
      )}
      {state.orderId === orderId && state.error && (
        <span className="flex items-center gap-1 text-xs text-brand-error">
          <AlertCircle className="h-3 w-3" /> {state.error}
        </span>
      )}
    </form>
  );
}

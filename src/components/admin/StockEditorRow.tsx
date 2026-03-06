"use client";

import { useActionState } from "react";
import { updateStockAction, type UpdateStockState } from "@/actions/update-stock";
import { formatPrice } from "@/lib/utils/format";
import { Check, AlertCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Variant {
  id: string;
  size: string;
  lavenderIncluded: boolean;
  sku: string | null;
  priceCents: number;
  stock: number;
}

interface StockEditorRowProps {
  variant: Variant;
}

const initialState: UpdateStockState = {};

export function StockEditorRow({ variant }: StockEditorRowProps) {
  const [state, formAction, pending] = useActionState(updateStockAction, initialState);

  const isThisRow = state.variantId === variant.id;

  return (
    <tr className="border-b border-brand-neutral-light/10 last:border-0 transition-colors hover:bg-brand-bg/30">
      <td className="py-3.5 pr-4 text-sm font-medium text-brand-dark">{variant.size}{variant.lavenderIncluded ? " + Lavendel" : ""}</td>
      <td className="py-3.5 pr-4 font-mono text-xs text-brand-neutral">
        {variant.sku ?? "–"}
      </td>
      <td className="py-3.5 pr-4 text-sm tabular-nums text-brand-dark">
        {formatPrice(variant.priceCents)}
      </td>
      <td className="py-3.5">
        <form action={formAction} className="flex items-center gap-2">
          <input type="hidden" name="variantId" value={variant.id} />
          <input
            name="stock"
            type="number"
            min={0}
            max={99999}
            defaultValue={state.success && isThisRow ? undefined : variant.stock}
            className="w-20 rounded-lg border border-brand-neutral-light/25 bg-white px-3 py-2 text-sm tabular-nums text-brand-dark outline-none transition-all focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/15 focus:shadow-sm"
          />
          <button
            type="submit"
            disabled={pending}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
              "bg-brand-dark text-white shadow-sm hover:bg-brand-dark-soft hover:shadow-md disabled:opacity-50",
            )}
          >
            {pending ? (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            Speichern
          </button>
          {isThisRow && state.success && (
            <span className="flex items-center gap-1 text-xs font-medium text-brand-success">
              <Check className="h-3 w-3" />
              Gespeichert
            </span>
          )}
          {isThisRow && state.error && (
            <span className="flex items-center gap-1 text-xs text-brand-error">
              <AlertCircle className="h-3 w-3" />
              {state.error}
            </span>
          )}
        </form>
      </td>
    </tr>
  );
}

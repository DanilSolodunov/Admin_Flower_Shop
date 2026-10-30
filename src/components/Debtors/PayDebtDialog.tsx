import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

import { DollarSign, AlertCircle } from "lucide-react";

interface PayDebtDialogProps {
  open: boolean;
  onClose: () => void;
  debtor: {
    id: number;
    name: string;
    debtAmount: number;
  } | null;
  onSubmit: (orderId: number, amount: number) => Promise<void>;
}

export const PayDebtDialog: React.FC<PayDebtDialogProps> = ({
  open,
  onClose,
  debtor,
  onSubmit,
}) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setAmount("");
      setError(null);
    }
  }, [open, debtor?.id]);

  if (!debtor) {
    return null;
  }

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 2,
    }).format(value);

  const handleSubmit = async () => {
    const paymentAmount = Number(amount);

    if (!amount || !Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      setError("Введите корректную сумму");
      return;
    }

    if (paymentAmount > debtor.debtAmount) {
      setError("Сумма оплаты не может превышать задолженность");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await onSubmit(debtor.id, paymentAmount);

      onClose();
    } catch (err) {
      console.error("Ошибка погашения долга:", err);
      setError("Не удалось погасить долг. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="z-[60] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            Погашение задолженности
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Введите сумму, которую клиент вносит в счёт долга.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-3">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-sm text-slate-400">Клиент</p>

            <p className="mt-1 text-lg font-semibold text-white">
              {debtor.name}
            </p>

            <p className="mt-4 text-sm text-slate-400">
              Текущая задолженность
            </p>

            <p className="mt-1 text-2xl font-bold text-red-400">
              {formatMoney(debtor.debtAmount)}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Сумма оплаты
            </label>

            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="number"
                min="0.01"
                max={debtor.debtAmount}
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                placeholder="Введите сумму"
                disabled={loading}
                className="w-full rounded-lg border border-slate-700
                           bg-slate-800 py-3 pl-10 pr-4 text-white
                           outline-none transition-colors
                           placeholder:text-slate-500
                           focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
          </div>

          {amount && Number(amount) > 0 && Number(amount) <= debtor.debtAmount && (
            <div className="rounded-lg border border-green-900/50 bg-green-950/30 p-3">
              <p className="text-sm text-slate-400">
                Остаток задолженности после оплаты
              </p>

              <p className="mt-1 text-xl font-semibold text-green-400">
                {formatMoney(debtor.debtAmount - Number(amount))}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg bg-slate-700 px-5 py-2.5 gap-x-2 gap-y-3
                       font-medium text-white hover:bg-slate-600
                       disabled:opacity-50"
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !amount}
            className="rounded-lg bg-green-600 px-5 py-2.5 gap-x-2 gap-y-3
                       font-medium text-white transition-colors
                       hover:bg-green-500 disabled:cursor-not-allowed
                       disabled:opacity-50"
          >
            {loading ? "Обработка..." : "Погасить долг"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayDebtDialog;
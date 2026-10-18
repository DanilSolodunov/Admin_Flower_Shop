
import React from "react";
import { X, Users, AlertCircle } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";

interface Debtor {
  id: number;
  name: string;
  orderNumber: string;
  debtAmount: number;
}

interface DebtorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Временные данные для проверки интерфейса.
const mockDebtors: Debtor[] = [
  {
    id: 1,
    name: "Иван Иванов",
    orderNumber: "ORD-001",
    debtAmount: 2500,
  },
  {
    id: 2,
    name: "Мария Смирнова",
    orderNumber: "ORD-002",
    debtAmount: 1800,
  },
  {
    id: 3,
    name: "Алексей Петров",
    orderNumber: "ORD-003",
    debtAmount: 4200,
  },
];

export const DebtorsModal: React.FC<DebtorsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  const totalDebt = mockDebtors.reduce(
    (sum, debtor) => sum + debtor.debtAmount,
    0
  );

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="debtors-title"
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto
                   rounded-2xl border border-slate-700
                   bg-slate-900 p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-500/10 p-3">
              <Users className="h-6 w-6 text-red-400" />
            </div>

            <div>
              <h2
                id="debtors-title"
                className="text-2xl font-bold text-white"
              >
                Список должников
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Клиенты с неоплаченными заказами
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно"
            className="rounded-lg p-2 text-slate-400
                       transition-colors hover:bg-slate-800
                       hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Сводная информация */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-sm text-slate-400">
              Количество должников
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {mockDebtors.length}
            </p>
          </div>

          <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4">
            <p className="text-sm text-red-300">
              Общая сумма задолженности
            </p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              {formatMoney(totalDebt)}
            </p>
          </div>
        </div>

        {/* Таблица должников */}
        <div className="overflow-x-auto">
          <Table theme="dark">
            <TableHeader theme="dark">
              <TableRow theme="dark">
                <TableHead theme="dark">Клиент</TableHead>
                <TableHead theme="dark">Номер заказа</TableHead>
                <TableHead theme="dark">Долг</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mockDebtors.length > 0 ? (
                mockDebtors.map((debtor) => (
                  <TableRow key={debtor.id} theme="dark">
                    <TableCell
                      theme="dark"
                      className="font-medium text-white"
                    >
                      {debtor.name}
                    </TableCell>

                    <TableCell theme="dark">
                      {debtor.orderNumber}
                    </TableCell>

                    <TableCell
                      theme="dark"
                      className="font-semibold text-red-400"
                    >
                      {formatMoney(debtor.debtAmount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow theme="dark">
                  <TableCell
                    theme="dark"
                    colSpan={4}
                    className="py-10 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-slate-500" />

                      <p className="text-slate-400">
                        Должников нет
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Нижняя часть окна */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-700 px-5 py-2.5
                       font-medium text-white transition-colors
                       hover:bg-slate-600"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebtorsModal;

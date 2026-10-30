import React, { useEffect, useState } from "react";
import { X, Users, AlertCircle } from "lucide-react";
import PayDebtDialog from "./PayDebtDialog";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";

import { getDebtorsReport, closeDebtorOrder } from "../../api/revenueApi";

interface Debtor {
  id: number;
  name: string;
  debtAmount: number;
}

interface DebtorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DebtorsModal: React.FC<DebtorsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [debtors, setDebtors] = useState<Debtor[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);

  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);


  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;

    const fetchDebtors = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getDebtorsReport();

        if (cancelled) {
          return;
        }

        const mappedDebtors: Debtor[] = data.map((debtor) => ({
          id: debtor.debtor_id,
          name: debtor.debtor_name,
          debtAmount: debtor.debtor_amount,
        }));

        setDebtors(mappedDebtors);
      } catch (err) {
        console.error("Ошибка загрузки должников:", err);

        if (!cancelled) {
          setError("Не удалось загрузить список должников");
          setDebtors([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDebtors();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const totalDebt = debtors.reduce(
    (sum, debtor) => sum + debtor.debtAmount,
    0
  );

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 2,
    }).format(amount);

  if (!isOpen) {
    return null;
  }

  const handleDebtorClick = (debtor: Debtor) => {
    setSelectedDebtor(debtor);
    setIsPayDialogOpen(true);
  };

  const handlePayDebt = async (debtorId: number, amount: number) => {
    try {
      console.log("Отправка платежа:", {
        debtorId,
        amount,
      });

      const response = await closeDebtorOrder(debtorId, amount);

      console.log("Ответ сервера:", response);

      const data = await getDebtorsReport();
      setDebtors(
        data.map((debtor) => ({
          id: debtor.debtor_id,
          name: debtor.debtor_name,
          debtAmount: debtor.debtor_amount,
        }))
      );
    } catch (error) {
      console.error("Ошибка погашения долга:", error);
      throw error;
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
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
        {/* Заголовок */}
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
              {loading ? "..." : debtors.length}
            </p>
          </div>

          <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4">
            <p className="text-sm text-red-300">
              Общая сумма задолженности
            </p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              {loading ? "..." : formatMoney(totalDebt)}
            </p>
          </div>
        </div>

        {/* Таблица должников */}
        <div className="overflow-x-auto">
          <Table theme="dark">
            <TableHeader theme="dark">
              <TableRow theme="dark">
                <TableHead theme="dark">Клиент</TableHead>
                <TableHead theme="dark">Долг</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow theme="dark">
                  <TableCell
                    theme="dark"
                    colSpan={2}
                    className="py-10 text-center text-slate-400"
                  >
                    Загрузка списка должников...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow theme="dark">
                  <TableCell
                    theme="dark"
                    colSpan={2}
                    className="py-10 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-red-400" />

                      <p className="text-red-400">{error}</p>

                      <button
                        type="button"
                        onClick={() => {
                          setError(null);
                          setLoading(true);

                          getDebtorsReport()
                            .then((data) => {
                              setDebtors(
                                data.map((debtor) => ({
                                  id: debtor.debtor_id,
                                  name: debtor.debtor_name,
                                  debtAmount: debtor.debtor_amount,
                                }))
                              );
                            })
                            .catch((err) => {
                              console.error(
                                "Ошибка повторной загрузки должников:",
                                err
                              );
                              setError(
                                "Не удалось загрузить список должников"
                              );
                            })
                            .finally(() => setLoading(false));
                        }}
                        className="mt-2 rounded-lg bg-slate-700 px-4 py-2
                                   text-sm text-white hover:bg-slate-600"
                      >
                        Повторить запрос
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : debtors.length > 0 ? (
                debtors.map((debtor) => (
                  // <TableRow key={debtor.id} theme="dark">
                  <TableRow
                    key={debtor.id}
                    theme="dark"
                    className="transition-colors hover:bg-slate-700/60"
                  >
                    <TableCell
                      theme="dark"
                      className="font-medium text-white cursor-pointer"
                      onClick={() => handleDebtorClick(debtor)}
                    >
                      {debtor.name}
                    </TableCell>

                    <TableCell
                      theme="dark"
                      className="font-semibold text-red-400 cursor-pointer"
                      onClick={() => handleDebtorClick(debtor)}
                    >
                      {formatMoney(debtor.debtAmount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow theme="dark">
                  <TableCell
                    theme="dark"
                    colSpan={2}
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

        <PayDebtDialog
          open={isPayDialogOpen}
          onClose={() => {
            setIsPayDialogOpen(false);
            setSelectedDebtor(null);
          }}
          debtor={selectedDebtor}
          onSubmit={handlePayDebt}
        />

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

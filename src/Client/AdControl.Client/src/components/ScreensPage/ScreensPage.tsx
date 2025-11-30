import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { Card } from "../ui/card.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.tsx";
import { Badge } from "../ui/badge.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.tsx";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store.ts";
import { fetchScreens, setPagination, createScreen, resetCreateStatus } from "../../store/screenSlice.ts";
import { Pagination } from "./Pagination.tsx";
import { CreateScreenForm } from "./CreateScreenForm.tsx";

export function ScreensPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const {
    items,
    total,
    limit,
    offset,
    status,
    createStatus,
    createError
  } = useSelector((state: RootState) => state.screens);

  useEffect(() => {
    dispatch(fetchScreens({ limit, offset }));
  }, [dispatch, limit, offset]);

  // Обработка успешного создания экрана
  useEffect(() => {
    if (createStatus === "succeeded") {
      setIsDialogOpen(false);
      // Можно добавить уведомление об успехе
      console.log("Экран успешно создан");
    }
  }, [createStatus]);

  const handleNextPage = () => {
    if (offset + limit < total) {
      dispatch(setPagination({ limit, offset: offset + limit }));
    }
  };

  const handlePrevPage = () => {
    if (offset - limit >= 0) {
      dispatch(setPagination({ limit, offset: offset - limit }));
    }
  };

  const handleCreateScreen = (screenData: {
    name: string;
    resolution: string;
    location: string;
  }) => {
    dispatch(createScreen(screenData));
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Сбрасываем статус создания при закрытии диалога
      dispatch(resetCreateStatus());
    }
  };

  // 🔹 Фильтрация по имени, локации и статусу
  const filteredScreens = items.filter((screen) => {
    const matchesSearch =
        screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
        statusFilter === "all" || screen.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 🔹 Бейджи статусов
  const getStatusBadge = (status: string | undefined) => {
    const styles = {
      connected: "bg-green-100 text-green-800 hover:bg-green-200",
      error: "bg-red-100 text-red-800 hover:bg-red-200",
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    };
    return (
        <Badge className={styles[status as keyof typeof styles] || ""}>
          {status || "unknown"}
        </Badge>
    );
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>Экраны</h1>
            <p className="text-gray-600 mt-1">Управляйте своей сетью экранов</p>
          </div>

          <Button
              style={{ backgroundColor: "#2563EB" }}
              className="gap-2"
              onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Добавить экран
          </Button>
        </div>

        {/* Таблица экранов */}
        <Card className="shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Искать по имени или расположению..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="connected">Подключено</SelectItem>
                  <SelectItem value="error">Ошибка</SelectItem>
                  <SelectItem value="pending">Соединение</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            {status === "loading" ? (
                <p className="p-4 text-gray-500">Загрузка экранов...</p>
            ) : filteredScreens.length === 0 ? (
                <p className="p-4 text-gray-500">Нет экранов</p>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Расположение</TableHead>
                      <TableHead>Разрешение</TableHead>
                      <TableHead>Статус подключения</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScreens.map((screen) => (
                        <TableRow key={screen.id}>
                          <TableCell>{screen.name}</TableCell>
                          <TableCell className="text-gray-600">
                            {screen.location}
                          </TableCell>
                          <TableCell>{screen.resolution}</TableCell>
                          <TableCell>{getStatusBadge(screen.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </div>

          <Pagination
              offset={offset}
              limit={limit}
              total={total}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
          />
        </Card>

        <CreateScreenForm
            isOpen={isDialogOpen}
            onOpenChange={handleDialogOpenChange}
            onSubmit={handleCreateScreen}
            isSubmitting={createStatus === "loading"}
            error={createError}
        />
      </div>
  );
}

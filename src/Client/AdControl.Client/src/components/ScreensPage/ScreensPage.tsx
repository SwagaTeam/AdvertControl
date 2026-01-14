import { useState, useEffect } from "react";
import {Plus, Search, Filter, QrCode, X} from "lucide-react";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { Card } from "../ui/card.tsx";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.tsx";
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
import { useNavigate } from 'react-router-dom';
import {formatDateShort} from "../../utils.ts";
import {TableLoader} from "./TableLoader.tsx";
import {getStatusBadge} from "./StatusBadge.tsx";


export function ScreensPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false); // ← новый стейт
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [initialCodeFromUrl, setInitialCodeFromUrl] = useState<string | undefined>(undefined);

  const navigate = useNavigate();


  const dispatch = useDispatch<AppDispatch>();
  const {
    items,
    total,
    limit,
    offset,
    createStatus,
    createError
  } = useSelector((state: RootState) => state.screens);

  useEffect(() => {
    dispatch(fetchScreens({ limit, offset }));
  }, [dispatch, limit, offset, createStatus]);

  useEffect(() => {
    if (createStatus === "succeeded") {
      setIsCreateDialogOpen(false);
      dispatch(resetCreateStatus());

      if (offset !== 0 || items.length === 0) {
        dispatch(setPagination({ limit, offset: 0 }));
      }
    }
  }, [createStatus, dispatch, offset, items.length, limit]);

  useEffect(() => {
    if (qrCodeValue) {
      setIsCreateDialogOpen(true);
      try {
        const url = new URL(qrCodeValue);
        const code = url.searchParams.get("code");
        if (code) {
          setQrCodeValue(code);
        }
      } catch {
        // если не получилось распарсить — оставляем как есть
      }
    }
  }, [qrCodeValue]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      setInitialCodeFromUrl(code);
      setIsCreateDialogOpen(true);

      const newUrl = `${location.pathname}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location.search, location.pathname]);

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
    setIsCreateDialogOpen(open);
    if (!open) {
      setQrCodeValue(null);
      dispatch(resetCreateStatus());
    }
  };

  const filteredScreens = items.filter((screen) => {
    const screenName = screen.name || "";
    const screenLocation = screen.location || "";

    const matchesSearch =
        screenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screenLocation.toLowerCase().includes(searchTerm.toLowerCase());


    return matchesSearch;
  });

  const handleQrScan = (detectedCodes: any[]) => {
    if (detectedCodes?.length > 0) {
      const value = detectedCodes[0].rawValue;
      if (value) {
        setQrCodeValue(value);
        setIsQrScannerOpen(false); // закрываем сканер сразу после успеха
      }
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>Экраны</h1>
            <p className="text-gray-600 mt-1">Управляйте своей сетью экранов</p>
          </div>

          <div className="flex gap-3">
            <Button
                style={{ backgroundColor: "#2563EB" }}
                className="gap-2"
                onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="element-plus">Добавить экран</span>
            </Button>

            <Button
                variant="outline"
                className="gap-2 element-qr"
                onClick={() => setIsQrScannerOpen(true)}
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isQrScannerOpen && (
            <div className="fixed inset-0 bg-black/50 flex flex-col items-center z-50 p-4">
              {/* Контейнер сканера */}

              <div className="max-w-lg w-full overflow-hidden rounded-xl">
                <div className="bg-white rounded-md p-2" style={{borderBottomLeftRadius: "0px",borderBottomRightRadius: "0px"}}>
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsQrScannerOpen(false)}
                  >
                    <X />
                  </Button >
                </div>
                <div className="aspect-video bg-black relative">

                  <Scanner
                      onScan={handleQrScan}
                      onError={(err) => console.error("Scanner error:", err)}
                      components={{
                        finder: true,
                      }}
                      styles={{
                        container: { height: "100%" },
                        video: { objectFit: "cover" },
                      }}
                      constraints={{ facingMode: "environment" }}
                  />
                </div>

                <div className="bg-white p-4 text-center text-sm text-gray-500">
                  Наведите камеру на QR-код с регистрацией экрана
                </div>
              </div>
            </div>
        )}

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
                <TableLoader />
            ) : filteredScreens.length === 0 ? (
                <p className="m-auto p-4 text-gray-500 ">Нет экранов</p>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Расположение</TableHead>
                      <TableHead>Разрешение</TableHead>
                      <TableHead>Статус подключения</TableHead>
                      <TableHead>Последнее обновление</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScreens.map((screen) => (
                        <TableRow
                            key={screen.id}
                            className="cursor-pointer"
                            onClick={() => navigate(`/crm/screen/${screen.id}`)}
                        >
                          <TableCell>{screen.name || "Не указано"}</TableCell>
                          <TableCell className="text-gray-600">
                            {screen.location || "Не указано"}
                          </TableCell>
                          <TableCell>{screen.resolution || "Не указано"}</TableCell>
                          <TableCell>{getStatusBadge(screen.status)}</TableCell>
                          <TableCell>{formatDateShort(screen?.updatedAt || "")}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </div>

          {status !== "loading" && (
              <Pagination
                  offset={offset}
                  limit={limit}
                  total={total}
                  onNextPage={handleNextPage}
                  onPrevPage={handlePrevPage}
              />
          )}
        </Card>

        <CreateScreenForm
            isOpen={isCreateDialogOpen}
            onOpenChange={handleDialogOpenChange}
            onSubmit={handleCreateScreen}
            isSubmitting={createStatus === "loading"}
            error={createError}
            initialCode={initialCodeFromUrl ?? qrCodeValue ?? undefined}
        />
      </div>
  );
}

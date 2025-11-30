import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../store/profileSlice.ts";
import { Navigate, useLocation } from "react-router-dom";
import {PreloaderPage} from "./Preloader.tsx";

interface Props {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
    const dispatch = useDispatch<any>();
    const location = useLocation();

    const { data: profile, loading, error } = useSelector((state: any) => state.profile);
    const { token } = useSelector((state: any) => state.auth);

    const initialized = useRef(false);
    const requestInProgress = useRef(false);

    useEffect(() => {
        if (!token || error) return;

        if (!initialized.current && !requestInProgress.current) {
            requestInProgress.current = true;
            dispatch(fetchProfile()).finally(() => {
                requestInProgress.current = false;
                initialized.current = true;
            });
        }
    }, [token, dispatch, error, initialized]);

    // === 1. Нет токена → отправляем на логин
    if (!token || error) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    if (initialized.current && error) {
        return <Navigate to="/login" replace />;
    }

    // === 3. Есть токен, но профиль ещё грузится → показываем loading
    if (loading && !initialized.current) {
        return <PreloaderPage />;
    }

    // === 4. Профиль загружен — показываем содержимое
    if (profile) {
        return <>{children}</>;
    }

    // === 5. fallback
    return <PreloaderPage />;
}

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { DashboardPage } from "./components/DashboardPage";
import { ScreensPage } from "./components/ScreensPage/ScreensPage.tsx";
import { LoginPage } from "./components/loginPage/LoginPage.tsx";
import { ProfileScreen } from "./components/ProfileScreen/ProfileScreen.tsx";
import { ScreenDetail } from "./components/ScreenDetailPage/ScreenDetailPage.tsx";
import { SettingsPage } from "./components/SettingsPage.tsx";
import { LandingPage } from "./components/LandingPage/LandingPage.tsx";
import { UsersPage } from "./components/UsersPage.tsx";
import { ImageGenerationPage } from "./components/ImageGenerationPage.tsx";
import { FilePage } from "./components/FilePage.tsx";

const SignageCreatorPage = lazy(() => import('./components/SignageCreatorPage/SignageCreatorPage.tsx'));
const MainLayout = lazy(() => import("./components/layouts/MainLayout"));

const LoadingFallback = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

export default function App() {
    return (
        <Router>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<LandingPage />} />
                    <Route
                        path="/screens/create-screen"
                        element={<Navigate to={{pathname: "/crm/screens", search: location.search}} replace/>}
                    />
                    <Route path="/crm" element={<MainLayout />} >
                        <Route index element={<DashboardPage />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="screens" element={<ScreensPage />} />
                        <Route path="profile" element={<ProfileScreen />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="user/:id" element={<ProfileScreen />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="screen/:id" element={<ScreenDetail />} />

                        <Route
                            path="screen/:id/config"
                            element={
                                <Suspense fallback={<LoadingFallback />}>
                                    <SignageCreatorPage />
                                </Suspense>
                            }
                        />
                        <Route
                            path="screen/:id/config/edit"
                            element={
                                <Suspense fallback={<LoadingFallback />}>
                                    <SignageCreatorPage />
                                </Suspense>
                            }
                        />

                        <Route path="ai" element={<ImageGenerationPage />} />
                        <Route path="files" element={<FilePage />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}

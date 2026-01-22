import {useState } from "react";
import { Header } from "./Header.tsx";
import { Sidebar } from "./Sidebar.tsx";
import {Outlet} from "react-router-dom";


export default function MainLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <main
                className="pt-16 transition-all duration-300 z-0"
                style={{
                    marginLeft: window.innerWidth >= 1024 ? (sidebarCollapsed ? "4rem" : "16rem") : "0",
                    paddingBottom: window.innerWidth < 1024 ? "4rem" : "0",
                }}
            >
                <div style={{
                    padding: window.innerWidth >= 1024 ? "1rem 1.5rem 0 1.5rem" : "1rem 1rem 0 1rem"
                }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

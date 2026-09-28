import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sidebar } from './Sidebar';
export const Layout = ({ children, currentPage, onNavigate }) => {
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(Sidebar, { currentPage: currentPage, onNavigate: onNavigate }), _jsx("main", { className: "flex-1 overflow-auto", children: children })] }));
};

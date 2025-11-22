import { Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import AddShowsPage from '../modules/Admin/pages/AddShowsPage';
import AdminDashboardPage from "../modules/Admin/pages/AdminDashboardPage";
import ListBookingsPage from "../modules/Admin/pages/ListBookingsPage";
import ListShowsPage from "../modules/Admin/pages/ListShowsPage";

export const adminRouter = (
    <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} /> 
        <Route path="add-shows" element={<AddShowsPage />} />
        <Route path="list-shows" element={<ListShowsPage />} />
        <Route path="list-bookings" element={<ListBookingsPage />} />
    </Route>
)
    

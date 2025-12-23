import { Route } from "react-router-dom";

import UserLayout from '../layouts/UserLayout';

import HomePage from "../modules/User/pages/HomePage";
import MoviePage from "../modules/User/pages/MoviePage";
import SeatBookingPage from "../modules/User/pages/SeatBookingPage";
import NotFoundPage from "../modules/User/pages/NotFoundPage";
import MyBookingPage from "../modules/User/pages/MyBookingPage";

export const userRouter = (
    <Route path="/" element={<UserLayout/>}>
        <Route index element={<HomePage/>} />
        <Route path="movie/:id" element={<MoviePage/>}/>
        <Route path="booking/:scheduleId" element={<SeatBookingPage />} />
        <Route path="*" element={<NotFoundPage/>}/>
        <Route path="/my-bookings" element={<MyBookingPage />} />
    </Route>
)

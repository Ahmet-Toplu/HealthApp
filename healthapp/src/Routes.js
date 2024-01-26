import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { NotFoundPage } from "./pages/NotFound";
import { LoginPage } from "./pages/Login";

export const Navigation = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <HomePage />
                }>
                </Route>
                <Route path="/Login" element={
                    <LoginPage />
                }>
                </Route>
                <Route element={
                    <NotFoundPage />
                }>
                </Route>
            </Routes>
        </Router>
    )
}
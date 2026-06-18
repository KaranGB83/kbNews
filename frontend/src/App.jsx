import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import ArticlePage from "./pages/ArticlePage";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-base-100"
            style={{background: "radial-gradient(ellipse at 60% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)",}}>
                <NavBar />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/create" element={<CreatePage />} />
                        <Route path="/article/:id" element={<ArticlePage />} />
                    </Routes>
                </main>
            </div>
            <Toaster position="bottom-right" />
        </BrowserRouter>
    );
}

export default App;
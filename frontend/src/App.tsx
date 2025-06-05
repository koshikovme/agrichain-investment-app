import React, { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/UI/navbar/Navbar";
import Footer from "./components/UI/footer/Footer";
import PersonalPage from "./pages/PersonalPage";
import InvestmentsPage from "./pages/InvestmentsPage";
import TransactionsPage from "./pages/TransactionsPage";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import MainPage from "./pages/MainPage";
import SolanaPayLinkGenerator from "./features/solana/SolanaPayLinkGenerator";
import './index.css'; 
const ENDPOINT = "https://api.devnet.solana.com";

const App = () => {
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);


    return (
        <ConnectionProvider endpoint={ENDPOINT}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <Router>
                        <Navbar />
                        <div style={{ paddingTop: "64px" }}> {/* высота AppBar */}
                            <Routes>
                                <Route path="/" element={<MainPage />} />
                                <Route path="/profile" element={<PersonalPage />} />
                                <Route path="/investments" element={<InvestmentsPage />} />
                                <Route path="/transactions" element={<TransactionsPage />} />
                                <Route
                                    path="/payments"
                                    element={
                                        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-4">
                                            <h1 className="text-2xl font-bold">Solana Payment System</h1>
                                            <WalletMultiButton />
                                            <SolanaPayLinkGenerator />
                                        </div>
                                    }
                                />
                            </Routes>
                        <Footer />
                        </div>
                    </Router>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
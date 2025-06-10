import React, { useState, useEffect } from 'react';
import { createQR } from '@solana/pay';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface QRProps {
    amount?: number;
    reference?: string;
    width?: number;
    height?: number;
}

const QR: React.FC<QRProps> = ({ amount, reference, width = 160, height = 160 }) => {
    const [qrCode, setQrCode] = useState<string>();
    const [qrReference, setQrReference] = useState<string>();
    const [verifying, setVerifying] = useState(false);
    const [canVerify, setCanVerify] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        const generate = async () => {
            setLoading(true);
            const res = await fetch('http://localhost:8083/api/pay', { method: 'POST' });
            const { url, ref } = await res.json();
            const qr = createQR(url);
            const qrBlob = await qr.getRawData('png');
            if (!qrBlob) {
                setLoading(false);
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                if (typeof event.target?.result === 'string') {
                    setQrCode(event.target.result);
                    setLoading(false);
                }
            };
            reader.readAsDataURL(qrBlob);
            setQrReference(ref);
        };
        generate();
    }, []);

    useEffect(() => {
        if (qrCode) {
            setCanVerify(false);
            const timer = setTimeout(() => setCanVerify(true), 10000);
            return () => clearTimeout(timer);
        }
    }, [qrCode]);

    const handleVerifyClick = async () => {
        if (!qrReference) return;
        setVerifying(true);
        const res = await fetch(`http://localhost:8083/api/pay?reference=${qrReference}`);
        const { status } = await res.json();
        setVerifying(false);
        if (status === 'verified') {
            navigate(`/payment-success?reference=${qrReference}`);
        } else {
            alert('Транзакция не найдена');
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                p: 0,
                m: 0,
                width: '100%',
                minWidth: 0,
                maxWidth: '100%',
            }}
        >
            <Typography
                variant="subtitle1"
                fontWeight={600}
                mb={1}
                textAlign="center"
            >
                Solana Pay
            </Typography>
            {loading ? (
                <CircularProgress sx={{ my: 2 }} />
            ) : qrCode ? (
                <Box
                    sx={{
                        background: "white",
                        borderRadius: 2,
                        p: 0.5,
                        mb: 1,
                        width,
                        height,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 1,
                    }}
                >
                    <img
                        src={qrCode}
                        alt="QR Code"
                        width={width - 16}
                        height={height - 16}
                        style={{ display: 'block', margin: '0 auto' }}
                    />
                </Box>
            ) : null}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={!canVerify || verifying || loading}
                onClick={handleVerifyClick}
                sx={{ mt: 1, fontSize: 14, minWidth: 0, maxWidth: '100%' }}
            >
                {verifying ? <CircularProgress size={20} /> : "Проверить транзакцию"}
            </Button>
            {!canVerify && qrCode && (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
                    Сканируйте QR-код. Кнопка проверки станет активна через 10 секунд.
                </Typography>
            )}
        </Box>
    );
};

export default QR;
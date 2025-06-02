import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

// Allow styled button to accept all props of MUI Button, including `component`
const AppleButton = styled((props: ButtonProps) => <Button {...props} />)<ButtonProps>(() => ({
    textTransform: 'none',
    borderRadius: 12,
    padding: '8px 16px',
    fontSize: '16px',
    fontWeight: 500,
    color: '#fff',
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
}));


export default AppleButton;
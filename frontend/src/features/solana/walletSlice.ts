// walletSlice.ts
import {createSlice} from "@reduxjs/toolkit";

const solanaWalletSlice = createSlice({
    name: 'solanaWallet',
    initialState: {
        address: null,
        balance: 0,
    },
    reducers: {
        setWallet(state, action) {
            state.address = action.payload.address;
            state.balance = action.payload.balance;
        },
    },
});

export const {setWallet} = solanaWalletSlice.actions;
export const selectWallet = (state: { solanaWallet: any; }) => state.solanaWallet;
export default solanaWalletSlice.reducer;


// export const fetchWallet = () => async (dispatch: any) => {
//     try {
//         const response = await fetch('/api/wallet'); // Replace with your API endpoint
//         const data = await response.json();
//         dispatch(setWallet({address: data.address, balance: data.balance}));
//     } catch (error) {
//         console.error('Failed to fetch wallet:', error);
//     }
// };
//

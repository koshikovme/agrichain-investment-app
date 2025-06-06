import {combineReducers} from "redux";
import userReducer from '../features/user/userSlice';
import investmentReducer from '../features/investment/investmentsSlice';
import authReducer from '../features/auth/authSlice';
import paymentReducer from '../features/payment/paymentsSlice';
import uploadReducer from '../features/upload/uploadSlice';

export const rootReducer = combineReducers({
    user: userReducer,
    investment: investmentReducer,
    auth: authReducer,
    payment: paymentReducer,
    upload: uploadReducer
})

export default rootReducer;
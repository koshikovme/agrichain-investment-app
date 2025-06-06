import Keycloak from 'keycloak-js';
import { store } from '../../app/store';
import {login, notifyAfterLogin} from './authSlice';
import {checkUserExists, createUser, fetchUserDetails} from "../user/userSlice";
import {unwrapResult} from "@reduxjs/toolkit";

// @ts-ignore
const keycloak = new Keycloak({
    // url: process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080',
    url: 'https://auth-agrichain.eu.ngrok.io',
    realm: 'master',
    clientId: 'agrichain-client-ac',
});

keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
}).then(async (authenticated: boolean) => {
    if (authenticated) {
        const tokenParsed = keycloak.tokenParsed;
        const username = tokenParsed?.preferred_username;
        const email = tokenParsed?.email;
        const mobileNumber = tokenParsed?.mobile_number;

        const result = await store.dispatch(checkUserExists(mobileNumber));
        if (checkUserExists.fulfilled.match(result) && result.payload === null) {
            const createResult = await store.dispatch(createUser(keycloak.token));
            if (createUser.fulfilled.match(createResult)) {
                console.log("User successfully created");
            } else {
                console.error("User creation failed");
                return;
            }

        } else {
            const userInfo = unwrapResult(await store.dispatch(fetchUserDetails(mobileNumber)));
            store.dispatch(
                notifyAfterLogin({
                    accountNumber: userInfo.accountsDto.accountNumber,
                    username: username
                })
            );
        }

        store.dispatch(login({ username, email, mobileNumber }));
    }
});



export { keycloak };

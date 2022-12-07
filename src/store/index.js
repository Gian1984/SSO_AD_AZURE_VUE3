import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            msalConfig: {
                auth: {
                    clientId: 'b7c94194-e71d-46e8-82d2-b332b1e55ab9',
                    authority:
                        'https://login.microsoftonline.com/078d41eb-2d00-480d-bf2c-fd6fd64623af',
                },
                cache: {
                    cacheLocation: 'localStorage',
                },
            },
            accessToken: ''
        };
    },
    mutations :{
        setAccessToken(state, token){
            state.accessToken = token;
        }
    }
});

export default store;
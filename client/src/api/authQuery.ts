import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authQuery = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_SERVER_URL?.trim() || "http://localhost:5000", }),
    endpoints: (builder) => ({
        signUp: builder.mutation({
            query: (data) => ({
                url: '/signup',
                method: 'POST',
                body: data,
                credentials: "include"
            })
        }),
        signIn: builder.mutation({
            query: (data) => ({
                url: '/signin',
                method: 'POST',
                body: data,
                credentials: "include"
            })
        }),
        signOut: builder.mutation({
            query: () => ({
                url: '/signout',
                method: 'POST',
                credentials: "include"
            })
        }),
        me: builder.query({
            query: () => ({
                url: '/me',
                method: 'GET',
                credentials: "include"
            })
        })
    })
})

export const {
    useSignUpMutation,
    useSignInMutation,
    useSignOutMutation,
    useMeQuery
} = authQuery















// import { createSlice } from "@reduxjs/toolkit";
// const initialState = [
// ]
// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {}
// })
// export default authSlice.reducer
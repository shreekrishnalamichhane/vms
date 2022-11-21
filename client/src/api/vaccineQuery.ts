import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const vaccineQuery = createApi({
    reducerPath: 'vaccine',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_SERVER_URL?.trim() || "http://localhost:5000" }),
    endpoints: (builder) => ({
        getAllVaccine: builder.query({
            query: () => ({
                url: '/vaccine',
                method: 'GET',
                credentials: "include"
            })
        }),
        getVaccine: builder.query({
            query: (id) => ({
                url: '/vaccine/' + id,
                method: 'GET',
                credentials: "include"
            })
        }),
        storeVaccine: builder.mutation({
            query: (data: any) => ({
                url: '/vaccine',
                method: 'POST',
                body: data,
                credentials: "include"
            })
        }),
        updateVaccine: builder.mutation({
            query: (data) => ({
                url: '/vaccine/' + data.id,
                method: 'PUT',
                body: data,
                credentials: "include"
            })
        }),
        deleteVaccine: builder.mutation({
            query: (data) => ({
                url: '/vaccine/' + data.id,
                method: 'DELETE',
                credentials: "include"
            })
        })
    })
})

export const {
    useGetAllVaccineQuery,
    useGetVaccineQuery,
    useStoreVaccineMutation,
    useUpdateVaccineMutation,
    useDeleteVaccineMutation
} = vaccineQuery















// import { createSlice } from "@reduxjs/toolkit";
// const initialState = [
// ]
// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {}
// })
// export default authSlice.reducer
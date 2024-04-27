import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dataPagination } from "./paginationFunction";

export const getSearch = createAsyncThunk(
    'data/search',
    async ({ searchData, token }) => {
        console.log('redux searchData: ', searchData)
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/v2/search?pa=${searchData.pa}&tecarea=${searchData.tecarea}&doc_num=${searchData.doc_num}&pdfrom=${searchData.pdfrom}&pdto=${searchData.pdto}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.ok) {
                const search = await response.json();
                return search;
            } else {
                const loginError = await response.json();
                console.log('redux loginError: ', loginError);
                throw loginError;
            }
        } catch (error) {
            console.error('Catch error: ', error)
            throw error;
        }
    }
)

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        fetchStatus: 'idle',
        error: null,
        pageSize: 8,
        page: null,
        pagedData: null
    },
    reducers: {
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: {
        [getSearch.pending]: (state) => {
            state.fetchStatus = 'pending';
        },
        [getSearch.fulfilled]: (state, action) => {
            state.error = null;
            const data = action.payload;
            console.log('redux data: ', data)
            // Aggiungo index ad ogni elemento
            const numberedData = data.map((element, index) => {
                return {...element, index: index}
            })
            // Impagino
            const pagedData = dataPagination(numberedData, state.pageSize)
            state.pagedData = pagedData;
            state.page = 1;
            state.fetchStatus = 'succeeded';
        },
        [getSearch.rejected]: (state, action) => {
            state.error = action.error.message;
            state.fetchStatus = 'error';
        },
    }
})

export const { setPageSize, setPage, updateFavouriteElement } = searchSlice.actions;
export default searchSlice.reducer;
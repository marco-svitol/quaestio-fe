import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dataPagination, sortArray } from "./paginationFunction";

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
        },
        sortDocuments: (state, action) => {
            const flatData = state.pagedData.flat();
            const sortedData = sortArray(flatData, action.payload.key, action.payload.reverse);
            // impagino
            const pagedData = dataPagination(sortedData, state.pageSize);
            state.pagedData = pagedData;
            state.page = 1;
        }
    },
    extraReducers: {
        [getSearch.pending]: (state) => {
            state.fetchStatus = 'pending';
        },
        [getSearch.fulfilled]: (state, action) => {
            state.error = null;
            const data = action.payload;
            console.log('redux data: ', data);
            // Impagino
            const pagedData = dataPagination(data, state.pageSize)
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

export const { setPageSize, setPage, updateFavouriteElement, sortDocuments } = searchSlice.actions;
export default searchSlice.reducer;
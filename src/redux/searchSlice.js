import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dataPagination } from "./paginationFunction";

export const getSearch = createAsyncThunk(
    'data/search',
    async ({ searchData, token }) => {
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
        pagedData: null,
        page: null
    },
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        updateFavouriteElement: (state, action) => { // Questo reducer va' a pescare l'oggetto relativo alla card che lo richiama, annidando l'index assoluto (che gli viene passato da DataPanel tramite prop)
            console.log('redux here: ', action.payload);
            const index = action.payload.index;
            console.log('redux here, index: ', index);
            const pageIndex = Math.floor(index / 8); // 8 è la quantità di oggetti per pagina
            console.log('redux her, pageIndex: ', pageIndex);
            const internalIndex = index % 8;
            console.log('redux here, internalIndex: ', internalIndex);
            state.pagedData[pageIndex][internalIndex].bookmark = action.payload.bookmark
        }
    },
    extraReducers: {
        [getSearch.pending]: (state) => {
            state.fetchStatus = 'pending';
        },
        [getSearch.fulfilled]: (state, action) => {
            state.error = null;
            const data = action.payload;
            const numberedData = data.map((element, index) => {
                return {...element, index: index}
            })
            state.pagedData = dataPagination(numberedData);
            state.page = 1;
            state.fetchStatus = 'succeeded';
        },
        [getSearch.rejected]: (state, action) => {
            state.error = action.error.message;
            state.fetchStatus = 'error';
        },
    }
})

export const { setPage, updateFavouriteElement } = searchSlice.actions;
export default searchSlice.reducer;
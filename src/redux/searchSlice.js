import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { booleanSortArray, dataPagination, emptyStringSortArray, sortArray } from "./paginationFunction";

export const getSearch = createAsyncThunk(
    'data/search',
    async ({ searchData, token, sort }) => {
        // In questo passaggio formatto la data in modo che il backend la riceva nel modo corretto
        let dataCopy = { ...searchData } // Eseguo una copia effettiva del seachData
        // Altrimenti modificando il formato della data ne risente anche il frontend
        dataCopy.pdfrom = dataCopy.pdfrom.replace(/-/g, '');
        dataCopy.pdto = dataCopy.pdto.replace(/-/g, '');
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/v2/search?pa=${dataCopy.pa}&tecarea=${dataCopy.tecarea}&doc_num=${dataCopy.doc_num}&pdfrom=${dataCopy.pdfrom}&pdto=${dataCopy.pdto}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.ok) {
                const search = await response.json();
                return { search, sort };
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

// Thunk per togglare lo stato del singolo documento
export const toggleDocumentStatus = createAsyncThunk(
    'status/toggle',
    async ({ token, familyId, newStatus }) => {
        const url = `${process.env.REACT_APP_SERVER_BASE_URL}/v2/docStatus?familyid=${familyId}&status=${newStatus}`;
        const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
        const options = { method: 'PATCH', headers };
        console.log('url: ', url)
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                const result = await response.json();
                console.log('result: ', result);
                return { familyId, newStatus };
            } else {
                const errorText = await response.text();
                throw errorText;
            }
        } catch (error) {
            console.error('Catch.error: ', error);
            throw error;
        }
    }
)

// Controllo che sia memorizzato in cache del browser il pageSize
const browserPageSize = localStorage.getItem('pageSize');
const initialPageSize = browserPageSize ? parseInt(browserPageSize) : 8;

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        fetchStatus: 'idle',
        error: null,
        pageSize: initialPageSize,
        page: 1,
        pagedData: null,
        isDocumentStatusStatus: 'idle',
    },
    reducers: {
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        repageDataPageSize: (state, action) => {
            const { newPageSize, sort } = action.payload;
            if (state.pagedData) {
                const oldData = [...state.pagedData];
                const flatData = oldData.flat();
                // risorto
                const sortedFlatData = sortArray(flatData, sort.key, sort.reverse)
                // reimpagino
                const newPagedFlatData = dataPagination(flatData, newPageSize);
                state.pagedData = newPagedFlatData;
            }
        },
        sortDocuments: (state, action) => {
            const { key, reverse } = action.payload;
            const flatData = state.pagedData.flat();
            // Sorto
            let sortedData;
            if (key === 'bookmark') {
                sortedData = booleanSortArray(flatData, key, reverse)
            } else if (key === 'notes') {
                sortedData = emptyStringSortArray(flatData, key, reverse)
            } else {
                sortedData = sortArray(flatData, key, reverse)
            }
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
            const data = action.payload.search;
            let dataWithoutUserinfo;
            if (Array.isArray(data)) {
                // tolgo lo userinfo se c'è
                dataWithoutUserinfo = data.filter(element => !Object.keys(element).includes('userinfo'));
            }
            const sort = action.payload.sort;
            // Sorto solo se il sortStatus è settato
            let sortedData = dataWithoutUserinfo;
            if (sort.key) {
                if (sort.key === 'bookmark') {
                    sortedData = booleanSortArray(data, sort.key, sort.reverse);
                } else if (sort.key === 'notes') {
                    sortedData = emptyStringSortArray(data, sort.key, sort.reverse);
                } else {
                    sortedData = sortArray(data, sort.key, sort.reverse);
                }
            }
            // Impagino
            let pagedData;
            if (Array.isArray(data)) {
                pagedData = dataPagination(sortedData, state.pageSize)
                state.pagedData = pagedData
            } else {
                state.pagedData = null;
            }
            state.fetchStatus = 'succeeded';
        },
        [getSearch.rejected]: (state, action) => {
            state.error = action.error.message;
            state.fetchStatus = 'error';
        },
        [toggleDocumentStatus.pending]: (state) => {
            state.isDocumentStatusStatus = 'loading';
        },
        [toggleDocumentStatus.fulfilled]: (state, action) => {
            const familyId = action.payload.familyId;
            const newStatus = action.payload.newStatus;
            const updatedPagedData = state.pagedData.map(page => {
                return page.map(document => {
                    if (document.familyid === familyId) {
                        return { ...document, read_history: newStatus};
                    } else {
                        return document
                    }
                })
            })
            state.pagedData = updatedPagedData;
            state.isDocumentStatusStatus = 'succeeded';
        },
        [toggleDocumentStatus.rejected]: (state, action) => {
            state.documentStatusError = action.error.message;
            state.isDocumentStatusStatus = 'failed';
        }
    }
})

export const { setPageSize, setPage, updateFavouriteElement, sortDocuments, repageDataPageSize } = searchSlice.actions;
export default searchSlice.reducer;
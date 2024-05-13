import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { booleanSortArray, dataPagination, emptyStringSortArray, sortArray } from "./paginationFunction.js";

export const getFavourites = createAsyncThunk(
    'favourites/favSearch',
    async ({ favouritesData, token, sort, pageSize, favCategorizedPagedData }) => {
        // In questo passaggio formatto la data in modo che il backend la riceva nel modo corretto
        let favouritesCopy = { ...favouritesData }; // creo una copia in modo che il frontend non risenta delle modifiche seguenti alla data
        favouritesCopy.pdfrom = favouritesCopy.pdfrom.replace(/-/g, '');
        favouritesCopy.pdto = favouritesCopy.pdto.replace(/-/g, '');
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/v2/searchbookmark?doc_num=${favouritesCopy.doc_num}&pdfrom=${favouritesCopy.pdfrom}&pdto=${favouritesCopy.pdto}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.ok) {
                const favourites = await response.json();
                return { favourites, sort, pageSize, favCategorizedPagedData };
            } else {
                const favError = await response.json();
                console.log('Fetch error: ', favError)
                throw favError;
            }
        } catch (error) {
            console.log('Catch error: ', error)
            throw error;
        }
    }
)

const favouritesSlice = createSlice({
    name: 'favourites',
    initialState: {
        favFetchStatus: 'idle',
        favError: null,
        favPagedData: null,
        favCategory: {
            id: null,
            name: null
        },
        favCategorizedPagedData: null,
        favPage: 1,
    },
    reducers: {
        setFavPage: (state, action) => {
            state.favPage = action.payload;
        },
        sortFavourites: (state, action) => {
            const pageSize = action.payload.pageSize;
            let flatData;
            if (action.payload.category) {
                flatData = state.favCategorizedPagedData.flat();
            } else {
                flatData = state.favPagedData.flat();
            }
            // Sorto
            let sortedData;
            if (action.payload.key === 'bookmark') {
                sortedData = booleanSortArray(flatData, action.payload.key, action.payload.reverse);
            } else if (action.payload.key === 'notes') {
                sortedData = emptyStringSortArray(flatData, action.payload.key, action.payload.reverse);
            } else {
                sortedData = sortArray(flatData, action.payload.key, action.payload.reverse);
            }
            // impagino
            const favPagedData = dataPagination(sortedData, pageSize);
            if (action.payload.category) {
                state.favCategorizedPagedData = favPagedData
            } else {
                state.favPagedData = favPagedData;
            }
            state.page = 1;
        },
        setCategory: (state, action) => {
            state.favCategory = action.payload
        },
        getCategory: (state, action) => {
            const { categoryId, pageSize } = action.payload;
            if (categoryId) {
                const flatData = state.favPagedData.flat();
                const categoryFavourites = flatData.filter(element => element.bmfolderid === categoryId);
                // Impagino
                const favCategorizedPagedData = dataPagination(categoryFavourites, pageSize);
                state.favCategorizedPagedData = favCategorizedPagedData;
                state.page = 1;
            } else {
                state.favCategorizedPagedData = null
            }

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFavourites.pending, (state) => {
                state.favFetchStatus = 'pending'
            })
            .addCase(getFavourites.fulfilled, (state, action) => {
                const pageSize = action.payload.pageSize;
                state.favError = null;
                const favourites = action.payload.favourites;
                const sort = action.payload.sort;
                // Sorto solo se il sortStatus è settato
                let sortedFavourites = favourites;
                if (sort.key && sortedFavourites !== '{}') {
                    if (sort.key === 'bookmark') {
                        sortedFavourites = booleanSortArray(favourites, sort.key, sort.reverse)
                    } else if (sort.key === 'notes') {
                        sortedFavourites = emptyStringSortArray(favourites, sort.key, sort.reverse)
                    } else {
                        sortedFavourites = sortArray(favourites, sort.key, sort.reverse)
                    }
                }
                // Impagino
                if (favourites !== '{}') {
                    state.favPagedData = dataPagination(sortedFavourites, pageSize);
                } else {
                    state.favPagedData = []
                }
                state.favFetchStatus = 'idle';
                // Aggiorno anche gli oggetti in categoria:
                if (state.favCategory.id) {
                    const categoryId = state.favCategory.id;
                    const flatData = state.favPagedData.flat();
                    const categoryFavourites = flatData.filter(element => element.bmfolderid === categoryId);
                    // Impagino
                    const favCategorizedPagedData = dataPagination(categoryFavourites, pageSize);
                    state.favCategorizedPagedData = favCategorizedPagedData;
                    state.page = 1;
                }
            })
            .addCase(getFavourites.rejected, (state, action) => {
                state.error = action.error.message;
                state.favFetchStatus = 'error';
            })
    }
})

export const { setFavPage, updateFavourite, sortFavourites, getCategory, setCategory } = favouritesSlice.actions;
export default favouritesSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunks for API calls
export const fetchEditors = createAsyncThunk(
    'editors/fetchEditors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/editor_gig`)
            return response.data || []
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch editors')
        }
    }
)

export const fetchEditorPlans = createAsyncThunk(
    'editors/fetchEditorPlans',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/editor_gig/plans`)
            return response.data || []
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch editor plans')
        }
    }
)

export const fetchOwnerVideos = createAsyncThunk(
    'editors/fetchOwnerVideos',
    async ({ userId, role, token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/videos/all/${role}/${userId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            return response.data || []
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch videos')
        }
    }
)

export const sendBookingRequest = createAsyncThunk(
    'editors/sendBookingRequest',
    async ({ requestData, token }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/requests/create`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Failed to send booking request'
            )
        }
    }
)

const initialState = {
    editors: [],
    plans: [],
    ownerVideos: [],
    combinedData: [],
    selectedEditor: null,
    selectedPlan: 'Basic',
    selectedVideo: null,
    projectDescription: '',
    showCustomPrice: false,
    customPrice: 0,
    isDrawerOpen: false,
    isModelOpen: false,
    // Filter states
    searchTerm: '',
    priceFilter: 'all',
    languageFilter: 'all',
    ratingFilter: 'all',
    // Loading states
    loadingEditors: false,
    loadingPlans: false,
    loadingVideos: false,
    sendingRequest: false,
    // Error states
    error: null,
}

const editorSlice = createSlice({
    name: 'editors',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload
        },
        setPriceFilter: (state, action) => {
            state.priceFilter = action.payload
        },
        setLanguageFilter: (state, action) => {
            state.languageFilter = action.payload
        },
        setRatingFilter: (state, action) => {
            state.ratingFilter = action.payload
        },
        setSelectedEditor: (state, action) => {
            state.selectedEditor = action.payload
        },
        setSelectedPlan: (state, action) => {
            state.selectedPlan = action.payload
        },
        setSelectedVideo: (state, action) => {
            state.selectedVideo = action.payload
        },
        setProjectDescription: (state, action) => {
            state.projectDescription = action.payload
        },
        setShowCustomPrice: (state, action) => {
            state.showCustomPrice = action.payload
        },
        setCustomPrice: (state, action) => {
            state.customPrice = action.payload
        },
        toggleDrawer: (state) => {
            state.isDrawerOpen = !state.isDrawerOpen
        },
        toggleModel: (state, action) => {
            state.isModelOpen = action.payload
        },
        resetBookingForm: (state) => {
            state.selectedVideo = null
            state.projectDescription = ''
            state.showCustomPrice = false
            state.customPrice = 0
            state.isModelOpen = false
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch editors
            .addCase(fetchEditors.pending, (state) => {
                state.loadingEditors = true
            })
            .addCase(fetchEditors.fulfilled, (state, action) => {
                state.editors = action.payload
                state.loadingEditors = false
                state.error = null
                // Update combined data when editors or plans change
                if (state.plans.length > 0) {
                    state.combinedData = state.editors.map((editor) => {
                        const plans = state.plans.filter(
                            (plan) => plan.email.trim().toLowerCase() === editor.email.trim().toLowerCase()
                        )
                        return { ...editor, plans }
                    })
                }
            })
            .addCase(fetchEditors.rejected, (state, action) => {
                state.loadingEditors = false
                state.error = action.payload
            })
            // Fetch editor plans
            .addCase(fetchEditorPlans.pending, (state) => {
                state.loadingPlans = true
            })
            .addCase(fetchEditorPlans.fulfilled, (state, action) => {
                state.plans = action.payload
                state.loadingPlans = false
                state.error = null
                // Update combined data when editors or plans change
                if (state.editors.length > 0) {
                    state.combinedData = state.editors.map((editor) => {
                        const plans = state.plans.filter(
                            (plan) => plan.email.trim().toLowerCase() === editor.email.trim().toLowerCase()
                        )
                        return { ...editor, plans }
                    })
                }
            })
            .addCase(fetchEditorPlans.rejected, (state, action) => {
                state.loadingPlans = false
                state.error = action.payload
            })
            // Fetch owner videos
            .addCase(fetchOwnerVideos.pending, (state) => {
                state.loadingVideos = true
            })
            .addCase(fetchOwnerVideos.fulfilled, (state, action) => {
                state.ownerVideos = action.payload.videos || []
                state.loadingVideos = false
                state.error = null
            })
            .addCase(fetchOwnerVideos.rejected, (state, action) => {
                state.loadingVideos = false
                state.error = action.payload
            })
            // Send booking request
            .addCase(sendBookingRequest.pending, (state) => {
                state.sendingRequest = true
            })
            .addCase(sendBookingRequest.fulfilled, (state) => {
                state.sendingRequest = false
                state.error = null
                // Reset form after successful booking
                state.selectedVideo = null
                state.projectDescription = ''
                state.showCustomPrice = false
                state.customPrice = 0
                state.isModelOpen = false
            })
            .addCase(sendBookingRequest.rejected, (state, action) => {
                state.sendingRequest = false
                state.error = action.payload
            })
    },
})

export const {
    setSearchTerm,
    setPriceFilter,
    setLanguageFilter,
    setRatingFilter,
    setSelectedEditor,
    setSelectedPlan,
    setSelectedVideo,
    setProjectDescription,
    setShowCustomPrice,
    setCustomPrice,
    toggleDrawer,
    toggleModel,
    resetBookingForm
} = editorSlice.actions

export default editorSlice.reducer 
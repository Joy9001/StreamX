import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'
import { format } from 'date-fns'
import {
    MessageSquare,
    Send,
    Clock,
    AlertCircle,
    X,
    User,
    Plus,
    RefreshCw
} from 'lucide-react'
import {
    fetchRequestMessages,
    sendMessage,
    clearMessages
} from '../../store/slices/messageSlice'

const MessageThread = ({ requestId, onClose, requestStatus = 'pending', messageCount = null }) => {
    const [newMessage, setNewMessage] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [hasCheckedMessages, setHasCheckedMessages] = useState(messageCount !== null)
    const [localMessageCount, setLocalMessageCount] = useState(messageCount || 0)
    const threadId = `thread-${requestId}`
    const messagesEndRef = useRef(null)
    const { getAccessTokenSilently } = useAuth0()
    const dispatch = useDispatch()

    const { messagesById, loading, sending, error, messageCounts } = useSelector((state) => state.messages)
    const userData = useSelector((state) => state.user.userData)
    const userRole = userData?.user_metadata?.role || 'Editor'

    // Get messages for this specific thread
    const rawMessages = messagesById[requestId] || []

    // Sort messages in chronological order (oldest first)
    const messages = [...rawMessages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    // Update local message count when messages are loaded or when count changes in redux
    useEffect(() => {
        // First try the direct messages array
        if (messages.length > 0) {
            setLocalMessageCount(messages.length)
            setHasCheckedMessages(true)
        }
        // Then check the global message counts
        else if (typeof messageCounts[requestId] !== 'undefined') {
            setLocalMessageCount(messageCounts[requestId])
            setHasCheckedMessages(true)
        }
        // If we have an explicit messageCount prop, use that
        else if (messageCount !== null) {
            setLocalMessageCount(messageCount)
            setHasCheckedMessages(true)
        }
    }, [messages, messageCounts, requestId, messageCount])

    // Determine if the thread is view-only based on request status
    const isViewOnly = requestStatus === 'approved' || requestStatus === 'rejected'

    // Function to scroll to bottom of message list
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Fetch messages when thread is opened
    const loadMessages = async (initialCheck = false) => {
        if (!requestId) return

        try {
            const accessToken = await getAccessTokenSilently()
            const response = await dispatch(fetchRequestMessages({ requestId, accessToken })).unwrap()
            if (initialCheck) {
                setHasCheckedMessages(true)
                if (response && response.messages) {
                    setLocalMessageCount(response.messages.length)
                }
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
            if (initialCheck) {
                setHasCheckedMessages(true)
            }
        }
    }

    // Handle refresh button click
    const handleRefresh = async () => {
        if (isRefreshing || !requestId) return

        setIsRefreshing(true)
        try {
            const accessToken = await getAccessTokenSilently()
            const response = await dispatch(fetchRequestMessages({ requestId, accessToken })).unwrap()
            if (response && response.messages) {
                setLocalMessageCount(response.messages.length)
            }
        } catch (error) {
            console.error('Error refreshing messages:', error)
        } finally {
            setIsRefreshing(false)
        }
    }

    // Initial load to check if there are any messages for view-only threads
    useEffect(() => {
        if (isViewOnly && !hasCheckedMessages && requestId) {
            loadMessages(true)
        }
    }, [isViewOnly, requestId, hasCheckedMessages])

    // Load messages when thread is opened
    useEffect(() => {
        if (isOpen) {
            loadMessages()
        }

        // Clean up when component unmounts
        return () => {
            if (isOpen) {
                dispatch(clearMessages(requestId))
            }
        }
    }, [isOpen, requestId, dispatch])

    // Scroll to bottom when messages change
    useEffect(() => {
        if (isOpen && messages.length > 0) {
            scrollToBottom()
        }
    }, [messages, isOpen])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (isViewOnly || !newMessage.trim() || !requestId || !userData) return

        try {
            const accessToken = await getAccessTokenSilently()
            const userId = userData._id || userData.sub || userData.id

            await dispatch(sendMessage({
                requestId,
                sender_id: userId,
                sender_role: userRole,
                sender_name: userData.user_metadata?.name || userData.name || userData.email || 'User',
                message: newMessage.trim(),
                accessToken
            }))

            setNewMessage('')
            setLocalMessageCount(prev => prev + 1)
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    const toggleThread = () => {
        setIsOpen(prev => !prev)
    }

    // Function to close the thread
    const closeThread = () => {
        setIsOpen(false)
        if (onClose) onClose()
    }

    // Format timestamp
    const formatMessageTime = (timestamp) => {
        try {
            return format(new Date(timestamp), 'MMM d, h:mm a')
        } catch (error) {
            return 'Unknown time'
        }
    }

    // Get status text for the button
    const getStatusText = () => {
        if (isViewOnly) {
            return localMessageCount > 0 ? 'View History' : 'No Messages';
        }
        return isOpen ? 'Close Thread' : 'Negotiation Thread';
    }

    // Determine if button should be disabled
    const isButtonDisabled = isViewOnly && !loading && !isRefreshing && localMessageCount === 0 && hasCheckedMessages;

    // Early return if view-only and no messages (after checking)
    if (isViewOnly && hasCheckedMessages && localMessageCount === 0) {
        return (
            <button
                disabled
                className="flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-500 opacity-60 cursor-not-allowed"
            >
                <MessageSquare className="mr-1 h-4 w-4" />
                <span>No Messages</span>
            </button>
        );
    }

    return (
        <div className="relative">
            {/* Message thread toggle button */}
            <button
                onClick={toggleThread}
                className={`flex items-center rounded-md ${isOpen ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'} px-3 py-1.5 text-sm font-medium transition-all ${isButtonDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={isButtonDisabled}
                data-thread-id={threadId}
            >
                <MessageSquare className="mr-1 h-4 w-4" />
                <span>
                    {loading && !hasCheckedMessages && isViewOnly ? 'Checking...' : getStatusText()}
                </span>
                {localMessageCount > 0 && !isOpen && (
                    <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-800">
                        {localMessageCount}
                    </span>
                )}
            </button>

            {/* Message thread panel */}
            {isOpen && (
                <div className="fixed right-4 top-[40%] z-50 w-80 rounded-lg border-2 border-indigo-200 bg-white shadow-2xl ring-4 ring-indigo-50 sm:w-96 md:w-[500px] transform -translate-y-1/2">
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2">
                        <h3 className="flex items-center text-sm font-semibold text-gray-800">
                            <MessageSquare className="mr-2 h-4 w-4 text-indigo-500" />
                            {isViewOnly ? 'Message History' : 'Negotiation Thread'}
                            {isViewOnly && (
                                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                    View Only
                                </span>
                            )}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleRefresh}
                                disabled={loading || isRefreshing}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-indigo-500 hover:bg-indigo-50 disabled:text-gray-300"
                                title="Refresh messages"
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={closeThread}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                title="Close thread"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Message list */}
                    <div className="h-64 overflow-y-auto p-3">
                        {loading ? (
                            <div className="flex h-full items-center justify-center">
                                <Clock className="mr-2 h-5 w-5 animate-spin text-indigo-500" />
                                <span className="text-sm text-gray-600">Loading messages...</span>
                            </div>
                        ) : error ? (
                            <div className="flex h-full items-center justify-center">
                                <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                                <span className="text-sm text-red-600">Error loading messages</span>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center">
                                <MessageSquare className="mb-2 h-10 w-10 text-gray-300" />
                                <p className="text-sm font-medium text-gray-500">No messages yet</p>
                                {!isViewOnly && (
                                    <p className="text-xs text-gray-400">Start the negotiation by sending a message</p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.sender_role === userRole ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[75%] rounded-lg px-3 py-2 ${msg.sender_role === userRole
                                                ? 'bg-indigo-500 text-white'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            <div className="mb-1 flex items-center justify-between text-xs">
                                                <span className="font-medium">
                                                    {msg.sender_name} ({msg.sender_role})
                                                </span>
                                            </div>
                                            <p className="text-sm">{msg.message}</p>
                                            <div className={`mt-1 text-right text-xs ${msg.sender_role === userRole ? 'text-indigo-100' : 'text-gray-500'
                                                }`}>
                                                {formatMessageTime(msg.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Message input - only show if not view-only */}
                    {!isViewOnly && (
                        <form onSubmit={handleSendMessage} className="border-t border-gray-100 p-3">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                    disabled={sending}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className={`flex items-center rounded-r-lg px-3 py-2 ${!newMessage.trim() || sending
                                        ? 'bg-gray-300 text-gray-500'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    {sending ? (
                                        <Clock className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}

export default MessageThread 
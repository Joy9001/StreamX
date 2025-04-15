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

const MessageThread = ({ requestId, onClose, requestStatus = 'pending' }) => {
    const [newMessage, setNewMessage] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const messagesEndRef = useRef(null)
    const { getAccessTokenSilently } = useAuth0()
    const dispatch = useDispatch()

    const { messages: rawMessages, loading, sending, error } = useSelector((state) => state.messages)
    const userData = useSelector((state) => state.user.userData)
    const userRole = userData?.user_metadata?.role || 'Editor'

    // Sort messages in chronological order (oldest first)
    const messages = [...rawMessages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    // Determine if the thread is view-only based on request status
    const isViewOnly = requestStatus === 'approved' || requestStatus === 'rejected'

    // Function to scroll to bottom of message list
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Fetch messages when thread is opened
    const loadMessages = async () => {
        if (!requestId) return

        try {
            const accessToken = await getAccessTokenSilently()
            dispatch(fetchRequestMessages({ requestId, accessToken }))
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }

    // Handle refresh button click
    const handleRefresh = async () => {
        if (isRefreshing || !requestId) return

        setIsRefreshing(true)
        try {
            const accessToken = await getAccessTokenSilently()
            await dispatch(fetchRequestMessages({ requestId, accessToken }))
        } catch (error) {
            console.error('Error refreshing messages:', error)
        } finally {
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            loadMessages()
        } else {
            dispatch(clearMessages())
        }

        return () => {
            dispatch(clearMessages())
        }
    }, [isOpen, requestId, dispatch])

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom()
    }, [messages])

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
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    const toggleThread = () => {
        setIsOpen(prev => !prev)
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
            return messages.length > 0 ? 'View Thread' : 'No Messages'
        }
        return isOpen ? 'Close Thread' : 'Negotiation Thread'
    }

    return (
        <div className="relative">
            {/* Message thread toggle button */}
            <button
                onClick={toggleThread}
                className={`flex items-center rounded-md ${isOpen ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'} px-3 py-1.5 text-sm font-medium transition-all`}
                disabled={isViewOnly && messages.length === 0}
            >
                <MessageSquare className="mr-1 h-4 w-4" />
                <span>
                    {getStatusText()}
                </span>
                {messages.length > 0 && !isOpen && (
                    <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-800">
                        {messages.length}
                    </span>
                )}
            </button>

            {/* Message thread panel */}
            {isOpen && (
                <div className="absolute right-0 top-full z-10 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg sm:w-96 md:w-[500px]">
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
                                onClick={onClose || toggleThread}
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
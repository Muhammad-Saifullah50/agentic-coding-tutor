'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { X, Send, BotMessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    id?: string;
}

export default function MentorChatbox() {
    const { user } = useUser();
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isExpanded) {
            scrollToBottom();
        }
    }, [messages, isExpanded]);

    // Fetch history on open
    useEffect(() => {
        if (isExpanded && messages.length === 0) {
            const fetchHistory = async () => {
                if (!user?.id) return;

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/mentor/history/${user.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.history && data.history.length > 0) {
                            setMessages(data.history);
                            return;
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch history:', error);
                }

                // If no history, show welcome message
                setMessages([
                    {
                        role: 'assistant',
                        content: "👋 Hi! I'm your AI Mentor. I'm here to help you with your studies, answer questions, plan your learning, and guide you toward your goals. What would you like to know?",
                    },
                ]);
            };

            fetchHistory();
        }
    }, [isExpanded, user?.id]);

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;
        if (!user?.id) {
            toast.error('Please log in to use the mentor');
            return;
        }

        const userMessage = inputValue.trim();
        setInputValue('');

        // Add user message immediately
        const userMsg: Message = { role: 'user', content: userMessage }
        setMessages(prev => [...prev, userMsg])
        setIsLoading(true)

        // Create placeholder for AI response
        const aiMsgId = Date.now().toString()
        setMessages(prev => [...prev, { role: 'assistant', content: '', id: aiMsgId }])

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/mentor/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    message: userMessage,
                }),
            })

            if (!response.ok) throw new Error('Failed to send message')
            if (!response.body) throw new Error('No response body')

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let aiResponse = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                const lines = chunk.split('\n')

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6)
                        if (data === '[DONE]') break

                        try {
                            const parsed = JSON.parse(data)
                            if (parsed.content) {
                                aiResponse += parsed.content
                                setMessages(prev =>
                                    prev.map(msg =>
                                        msg.id === aiMsgId ? { ...msg, content: aiResponse } : msg
                                    )
                                )
                            } else if (parsed.error) {
                                toast.error(parsed.error)
                                setMessages(prev => prev.filter(msg => msg.id !== aiMsgId))
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e)
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
            setMessages((prev) => prev.filter(msg => msg.id !== aiMsgId));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Collapsed Button */}
            {!isExpanded && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="fixed bottom-24 right-6 z-50 group"
                    aria-label="Open AI Mentor"
                >
                    <div className="relative">
                        {/* Pulse animation ring */}
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />

                        {/* Main button */}
                        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 
                          shadow-lg hover:shadow-xl transition-all duration-300 
                          flex items-center justify-center group-hover:scale-110">
                            <BotMessageSquare className="w-6 h-6 text-primary-foreground" />
                        </div>
                    </div>
                </button>
            )}

            {/* Expanded Chatbox */}
            {isExpanded && (
                <div className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] max-h-[80vh] 
                      bg-card border border-border rounded-2xl shadow-2xl 
                      flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300
                      sm:w-[400px] md:w-[420px]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BotMessageSquare className="w-5 h-5 text-primary-foreground" />
                            <h3 className="font-semibold text-primary-foreground">AI Mentor</h3>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsExpanded(false)}
                            className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-secondary/5">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary/50 text-secondary-foreground border border-border'
                                        }`}
                                >
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            {msg.content ? (
                                                <ReactMarkdown>
                                                    {typeof msg.content === 'string'
                                                        ? msg.content
                                                        : JSON.stringify(msg.content, null, 2)}
                                                </ReactMarkdown>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span className="text-sm text-muted-foreground">Thinking...</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border bg-card">
                        <div className="flex items-center gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about your studies..."
                                disabled={isLoading}
                                className="flex-1 bg-background"
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                size="icon"
                                className="shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

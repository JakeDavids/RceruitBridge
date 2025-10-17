
import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/api/entities";
import { MailThread, Message } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Kept for potential future use or if searchTerm logic is reactivated
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Search, // Kept for potential future use or if searchTerm logic is reactivated
  RefreshCw, // Removed from UI, but kept as a utility for now. Could be removed if not used.
  Send,
  Loader2,
  Inbox // Added Inbox icon
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useWalkthrough } from "@/components/onboarding/GlobalWalkthroughContext";

export default function ResponseCenter() {
  const [user, setUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search input UI removed, but state kept for loadData logic
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const { isTutorialMode } = useWalkthrough();

  const loadData = useCallback(async () => {
    setLoading(true);
    
    try {
      const currentUser = await User.me();
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      setUser(currentUser);
      
      let allThreads = await MailThread.filter({ userId: currentUser.id });
      
      // Keep search logic, even if UI input is removed based on outline
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        allThreads = allThreads.filter(t => 
          t.subject?.toLowerCase().includes(searchLower) ||
          t.participants?.toLowerCase().includes(searchLower)
        );
      }
      
      allThreads.sort((a, b) => {
        const aTime = new Date(a.lastAt || a.created_date);
        const bTime = new Date(b.lastAt || b.created_date);
        return bTime - aTime;
      });
      
      const threadsWithSnippets = await Promise.all(
        allThreads.slice(0, 50).map(async (thread) => {
          try {
            const messages = await Message.filter({ threadId: thread.id });
            messages.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
            const lastMessage = messages[0];
            
            return {
              id: thread.id,
              subject: thread.subject || 'No Subject',
              // Convert participants array to a string for display as per new UI
              participants: thread.participants ? thread.participants.split(',').join(', ') : 'N/A',
              lastAt: thread.lastAt || thread.created_date, // Renamed to lastAt for consistency with new UI display
              lastSnippet: lastMessage?.text?.substring(0, 140) || '',
              unread: (thread.unreadCount || 0) > 0 // Use a boolean 'unread' flag for the new UI
            };
          } catch (err) {
            console.error("Error processing thread messages:", err); // Log error but don't fail entire load
            return {
              id: thread.id,
              subject: thread.subject || 'No Subject',
              participants: thread.participants ? thread.participants.split(',').join(', ') : 'N/A',
              lastAt: thread.lastAt || thread.created_date,
              lastSnippet: '',
              unread: (thread.unreadCount || 0) > 0
            };
          }
        })
      );
      
      setThreads(threadsWithSnippets);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  }, [searchTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Renamed to handleSelectThread to match original behavior, not just setSelectedThread
  const handleSelectThread = async (thread) => {
    setLoadingThread(true);
    setSelectedThread(thread);
    
    // Mark as read for tutorial
    if (isTutorialMode) {
      window.__demoThreadRead = true;
    }
    
    try {
      const messages = await Message.filter({ threadId: thread.id });
      messages.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
      setThreadMessages(messages);
    } catch (error) {
      console.error("Error loading messages:", error);
      setThreadMessages([]);
    }
    
    setLoadingThread(false);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedThread) return;
    
    setSendingReply(true);
    try {
      // In tutorial mode, just show success
      if (isTutorialMode) {
        alert("Demo reply sent!");
        setReplyText("");
        setSendingReply(false);
        return;
      }

      // Real send logic here
      await Message.create({
        threadId: selectedThread.id,
        mailboxId: user.mailboxId || "default",
        direction: "OUT",
        from: user.email,
        // When participants is a string, split it for the 'to' field if it contains multiple, or take the first.
        // Assuming the first participant is the recipient for replies.
        to: selectedThread.participants.includes(',') ? selectedThread.participants.split(',')[0].trim() : selectedThread.participants.trim(),
        subject: `Re: ${selectedThread.subject}`,
        text: replyText
      });
      
      setReplyText("");
      await handleSelectThread(selectedThread); // Reload selected thread to show new message
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply. Please try again.");
    }
    setSendingReply(false);
  };

  // Removed the initial loading state full screen takeover to allow the main layout to load faster
  // and show a loading state within the thread list instead.

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Hero Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Response Center</h1>
        <p className="text-lg text-slate-600">Track all your coach conversations in one place</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Thread List - Full Height */}
          <Card className="bg-white/80 backdrop-blur shadow-xl md:col-span-1 h-full flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-lg font-bold">Conversations</CardTitle>
              {/* Search input removed as per outline */}
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : threads.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  <Inbox className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {threads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => handleSelectThread(thread)}
                      className={`w-full p-4 text-left hover:bg-blue-50 transition-colors ${
                        selectedThread?.id === thread.id ? 'bg-blue-100' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-semibold text-slate-900 truncate flex-1">
                          {thread.subject}
                        </span>
                        {thread.unread && (
                          <Badge className="bg-blue-600 text-white ml-2">New</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{thread.participants}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(thread.lastAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message Viewer - Full Height */}
          <Card className="bg-white/80 backdrop-blur shadow-xl md:col-span-2 h-full flex flex-col">
            {selectedThread ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-bold">{selectedThread.subject}</CardTitle>
                  <p className="text-sm text-slate-500">{selectedThread.participants}</p>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-6 space-y-4">
                  {loadingThread ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {threadMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.direction === 'OUT' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              msg.direction === 'OUT'
                                ? 'bg-purple-500 text-white'
                                : 'bg-slate-100 text-slate-900'
                            }`}
                          >
                            <p className="text-xs mb-1 opacity-75">{msg.from}</p>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            <p className="text-xs mt-1 opacity-75">
                              {format(new Date(msg.created_date), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className="flex-1 resize-none" // Added resize-none to prevent manual resizing
                    />
                    <Button 
                      onClick={handleSendReply} 
                      disabled={!replyText.trim() || sendingReply}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {sendingReply ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Inbox className="w-16 h-16 mx-auto mb-4" />
                  <p>Select a conversation to view messages</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

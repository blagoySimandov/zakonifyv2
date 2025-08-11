"use client";

import { useState } from "react";
import { X, Send, MessageSquare, Users, User } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import type { Doc } from "../../../convex/_generated/dataModel";

type ClientWithDetails = Doc<"clients"> & {
  totalConsultations: number;
  lastConsultation?: Doc<"consultations"> | null;
  activeMatter?: Doc<"matters"> | null;
};

type MessageDoc = Doc<"messages">;

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  attorneyId: string;
  clients: ClientWithDetails[];
}

export function ChatDialog({
  isOpen,
  onClose,
  attorneyId,
  clients,
}: ChatDialogProps) {
  const [selectedClient, setSelectedClient] =
    useState<ClientWithDetails | null>(null);
  const [messageText, setMessageText] = useState("");

  // Get messages for the selected client's matter
  const activeMatterId = selectedClient?.activeMatter?._id;

  const messages = useQuery(
    api.messages.listByMatter,
    activeMatterId ? { matterId: activeMatterId } : "skip"
  );

  const sendMessage = useMutation(api.messages.send);

  const handleSend = async () => {
    if (!activeMatterId || !messageText.trim()) return;

    await sendMessage({
      matterId: activeMatterId,
      senderRole: "attorney",
      senderId: attorneyId as Id<"attorneys">,
      content: messageText.trim(),
    });

    setMessageText("");
    // Convex automatically refetches queries when mutations complete
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 z-40 bg-white rounded-2xl shadow-2xl w-96 h-[500px] border border-gray-200 flex overflow-hidden">
      {/* When no client is selected, show client list */}
      {!selectedClient ? (
        <div className="w-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Clients</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {clients.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No clients yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {clients.map((client) => (
                  <button
                    key={String(client._id)}
                    onClick={() => setSelectedClient(client)}
                    className="w-full text-left p-3 rounded-lg transition-colors hover:bg-gray-50 border border-transparent"
                  >
                    <div className="font-medium text-gray-900 text-sm">
                      {client.fullName}
                    </div>
                    <div className="text-xs text-gray-500">{client.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {client.totalConsultations} consultation
                      {client.totalConsultations !== 1 ? "s" : ""}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* When client is selected, show chat */
        <div className="w-full flex flex-col">
          {!selectedClient.activeMatter ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No active matter
                </h3>
                <p className="text-gray-500 text-sm px-4">
                  This client doesn&apos;t have an active matter to chat about
                  yet.
                </p>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
                >
                  ← Back to clients
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {selectedClient.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {selectedClient.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {((messages || []) as MessageDoc[]).map((message) => (
                  <div
                    key={String(message._id)}
                    className={`flex ${
                      message.senderRole === "attorney"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.senderRole === "attorney"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          message.senderRole === "attorney"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {messages?.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!messageText.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

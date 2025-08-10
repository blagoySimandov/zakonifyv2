"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatDialog } from "../chat-dialog";
import { trpc } from "@/utils";

interface ChatFabProps {
  attorneyId: string;
}

export function ChatFab({ attorneyId }: ChatFabProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch clients for chat
  const { data: clients = [] } = trpc.clients.getByAttorneyId.useQuery({
    attorneyId,
  });

  const toggleOpen = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
    } else {
      setIsChatOpen(true);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleOpen}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
            isChatOpen
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {isChatOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </button>

        {/* Badge showing number of clients */}
        {clients.length > 0 && !isChatOpen && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
            {clients.length > 99 ? "99+" : clients.length}
          </div>
        )}
      </div>

      {/* Chat Dialog */}
      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        attorneyId={attorneyId}
        clients={clients}
      />
    </>
  );
}

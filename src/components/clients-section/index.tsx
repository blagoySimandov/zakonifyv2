"use client";

import { Users, Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import type { Doc } from "../../../convex/_generated/dataModel";

type ClientWithDetails = Doc<"clients"> & {
  totalConsultations: number;
  lastConsultation?: Doc<"consultations"> | null;
  activeMatter?: Doc<"matters"> | null;
};

interface ClientsSectionProps {
  clients: ClientWithDetails[];
  onClientClick?: (client: ClientWithDetails) => void;
}

export function ClientsSection({
  clients,
  onClientClick,
}: ClientsSectionProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">
          Current Clients
        </h2>
      </div>

      {clients.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No clients yet. Start accepting consultations to see your clients
          here.
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {clients.map((client) => (
            <div
              key={String(client._id)}
              className="flex items-center justify-between rounded-md border p-3 hover:bg-slate-50 cursor-pointer"
              onClick={() => onClientClick?.(client)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="font-medium text-slate-900">
                    {client.fullName}
                  </div>
                  {client.lastConsultation && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.lastConsultation.status)}`}
                    >
                      {client.lastConsultation.status}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-3 w-3" />
                    <span>{client.email}</span>
                  </div>

                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-3 w-3" />
                      <span>{client.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {client.totalConsultations} consultation
                      {client.totalConsultations !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {client.lastConsultation && (
                    <div className="text-sm text-slate-500">
                      Last consultation:{" "}
                      {new Date(
                        client.lastConsultation.scheduledAt,
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {client.activeMatter && (
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <MessageSquare className="h-3 w-3" />
                    <span>Active</span>
                  </div>
                )}

                <div className="text-xs text-slate-400">
                  Client since {new Date(client.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

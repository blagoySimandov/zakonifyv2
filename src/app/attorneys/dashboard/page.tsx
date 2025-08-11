"use client";

import { ElementType, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { AttorneyLayout } from "@/components";
import { MOCK_ATTORNEY_ID } from "@/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Calendar,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

// Mock data for demonstrations
const earningsData = [
  { month: "Jan", earnings: 2400 },
  { month: "Feb", earnings: 1398 },
  { month: "Mar", earnings: 9800 },
  { month: "Apr", earnings: 3908 },
  { month: "May", earnings: 4800 },
  { month: "Jun", earnings: 3800 },
];

const clientsData = [
  { month: "Jan", clients: 12 },
  { month: "Feb", clients: 19 },
  { month: "Mar", clients: 15 },
  { month: "Apr", clients: 25 },
  { month: "May", clients: 22 },
  { month: "Jun", clients: 28 },
];

const recentReviews = [
  {
    id: "1",
    clientName: "John Doe",
    rating: 5,
    comment:
      "Excellent attorney! Very professional and got great results for my case.",
    date: "2024-01-15",
  },
  {
    id: "2",
    clientName: "Sarah Johnson",
    rating: 4,
    comment:
      "Good communication throughout the process. Satisfied with the outcome.",
    date: "2024-01-12",
  },
  {
    id: "3",
    clientName: "Mike Wilson",
    rating: 5,
    comment: "Highly recommend! Knowledgeable and responsive attorney.",
    date: "2024-01-10",
  },
];

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "#3b82f6",
  },
  clients: {
    label: "Clients",
    color: "#10b981",
  },
};

export default function AttorneyDashboard() {
  const [attorneyId] = useState<string>(MOCK_ATTORNEY_ID);

  // Fetch attorney data
  const consultations = useQuery(api.consultations.getByAttorneyId, {
    attorneyId: attorneyId as Id<"attorneys">,
    status: undefined,
  }) || [];

  // Calculate stats
  const totalEarnings = earningsData.reduce(
    (sum, item) => sum + item.earnings,
    0,
  );
  const totalClients = clientsData.reduce((sum, item) => sum + item.clients, 0);
  const averageRating =
    recentReviews.reduce((sum, review) => sum + review.rating, 0) /
    recentReviews.length;
  const totalConsultations = consultations.length;

  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    trend,
    gradient,
    iconBg,
    iconColor,
  }: {
    title: string;
    value: string | number;
    icon: ElementType;
    change?: string;
    trend?: "up" | "down";
    gradient: string;
    iconBg: string;
    iconColor: string;
  }) => (
    <Card
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${gradient} relative overflow-hidden`}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 -right-4 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white rounded-full"></div>
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
          {title}
        </CardTitle>
        <div className={`p-3 ${iconBg} rounded-xl shadow-sm`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
          {value}
        </div>
        {change && (
          <div
            className={`text-sm font-medium ${trend === "up" ? "text-emerald-600" : "text-red-600"} flex items-center gap-2`}
          >
            <div
              className={`p-1 rounded-full ${trend === "up" ? "bg-emerald-100" : "bg-red-100"}`}
            >
              <TrendingUp
                className={`h-3 w-3 ${trend === "up" ? "text-emerald-600" : "text-red-600"}`}
              />
            </div>
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

  return (
    <AttorneyLayout title="Dashboard" attorneyId={attorneyId}>
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Earnings"
            value={`$${totalEarnings.toLocaleString()}`}
            icon={DollarSign}
            change="+12.5% from last month"
            trend="up"
            gradient="from-emerald-50 via-white to-emerald-50/30"
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />
          <StatCard
            title="Total Clients"
            value={totalClients}
            icon={Users}
            change="+8.2% from last month"
            trend="up"
            gradient="from-blue-50 via-white to-blue-50/30"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Average Rating"
            value={averageRating.toFixed(1)}
            icon={Star}
            change="+0.2 from last month"
            trend="up"
            gradient="from-yellow-50 via-white to-yellow-50/30"
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatCard
            title="Consultations"
            value={totalConsultations}
            icon={Calendar}
            gradient="from-purple-50 via-white to-purple-50/30"
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings Chart */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-blue-50/20">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <div className="p-1 bg-green-100 rounded">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                Monthly Earnings
              </CardTitle>
              <CardDescription className="text-slate-600">
                Revenue over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={earningsData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="earningsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`$${value}`, "Earnings"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#earningsGradient)"
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{
                        r: 6,
                        fill: "#3b82f6",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Clients Chart */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-emerald-50/20">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <div className="p-1 bg-emerald-100 rounded">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                Client Growth
              </CardTitle>
              <CardDescription className="text-slate-600">
                New clients acquired each month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={clientsData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="clientsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.4}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [value, "New Clients"]}
                    />
                    <Bar
                      dataKey="clients"
                      fill="url(#clientsGradient)"
                      radius={[4, 4, 0, 0]}
                      stroke="#10b981"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reviews */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-white to-orange-50/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <div className="p-1 bg-orange-100 rounded">
                    <MessageSquare className="h-4 w-4 text-orange-600" />
                  </div>
                  Recent Reviews
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Latest client feedback
                </CardDescription>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors">
                See All
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white/50 rounded-lg p-4 border border-slate-100 last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-medium text-slate-900">
                        {review.clientName}
                      </div>
                      <RatingStars rating={review.rating} />
                      <span className="text-sm text-slate-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AttorneyLayout>
  );
}

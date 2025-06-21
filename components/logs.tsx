"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Sparkles,
  RefreshCw,
  Download,
  Eye,
} from "lucide-react"
import { getEmailLogs, type EmailLog } from "@/lib/supabase"
import { formatDate } from "@/lib/utils/utils"

interface LogsProps {
  userId?: string
}

export default function ModernLogs({ userId }: LogsProps) {
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)
  const logsPerPage = 10

  const fetchLogs = async (showRefreshing = false) => {
    if (!userId) return

    if (showRefreshing) setRefreshing(true)
    else setLoading(true)

    try {
      const { logs: data, total } = await getEmailLogs(
        userId,
        currentPage,
        logsPerPage,
        searchTerm,
        statusFilter === "all" ? undefined : statusFilter,
      )
      setLogs(data)
      setTotalLogs(total)
      setTotalPages(Math.ceil(total / logsPerPage))
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [userId, currentPage, searchTerm, statusFilter])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleRefresh = () => {
    fetchLogs(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "failure":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case "processing":
        return <Clock className="h-4 w-4 text-blue-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: {
        className: "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      failure: {
        className: "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30",
        icon: <XCircle className="h-3 w-3" />,
      },
      warning: {
        className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30",
        icon: <AlertCircle className="h-3 w-3" />,
      },
      processing: {
        className: "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30",
        icon: <Clock className="h-3 w-3" />,
      },
    }

    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.processing

    return (
      <Badge className={`flex items-center gap-1 transition-colors ${config.className}`}>
        {config.icon}
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
          }}
          className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
      <div className="fixed bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Activity Monitor</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Email Logs
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Monitor email processing activities, track system performance, and analyze transaction patterns
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Logs", value: totalLogs, icon: Activity, color: "blue" },
            { label: "Success Rate", value: "94.2%", icon: CheckCircle, color: "green" },
            { label: "Active Today", value: "127", icon: Clock, color: "yellow" },
            { label: "Errors", value: "3", icon: XCircle, color: "red" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="glass border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-500/20`}>
                      <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Logs Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-dark border-slate-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
                    <Activity className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Activity Logs</CardTitle>
                    <CardDescription className="text-slate-400">
                      Real-time monitoring of email processing activities
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    {refreshing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full"
                      />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search logs by message, account ID..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                </div>
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[200px] bg-slate-800/50 border-slate-600/50 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-white">
                      All Status
                    </SelectItem>
                    <SelectItem value="success" className="text-white">
                      Success
                    </SelectItem>
                    <SelectItem value="failure" className="text-white">
                      Failure
                    </SelectItem>
                    <SelectItem value="warning" className="text-white">
                      Warning
                    </SelectItem>
                    <SelectItem value="processing" className="text-white">
                      Processing
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="relative">
              <AnimatePresence mode="wait">
                {logs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="p-4 bg-slate-800/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-400 text-lg">
                      {searchTerm || statusFilter !== "all"
                        ? "No logs found matching your criteria"
                        : "No logs available"}
                    </p>
                    <p className="text-slate-500 text-sm mt-2">
                      Logs will appear here as email processing activities occur
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Table */}
                    <div className="rounded-lg border border-slate-700/50 overflow-hidden bg-slate-800/20">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                            <TableHead className="text-slate-300 font-semibold">Date & Time</TableHead>
                            <TableHead className="text-slate-300 font-semibold">Status</TableHead>
                            <TableHead className="text-slate-300 font-semibold">Message</TableHead>
                            <TableHead className="text-slate-300 font-semibold">Account ID</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {logs.map((log, index) => (
                            <motion.tr
                              key={log.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-slate-700/50 hover:bg-slate-700/20 transition-colors group"
                            >
                              <TableCell className="text-slate-300 font-medium">
                                <div className="flex flex-col">
                                  <span>{formatDate(log.created_at)}</span>
                                  <span className="text-xs text-slate-500">
                                    {new Date(log.created_at).toLocaleTimeString()}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(log.status)}</TableCell>
                              <TableCell className="text-slate-300 max-w-md">
                                <div
                                  className="truncate group-hover:whitespace-normal group-hover:break-words transition-all"
                                  title={log.message || "No message"}
                                >
                                  {log.message || "—"}
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-400 font-mono text-sm">#{log.account_id}</TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-slate-400">
                        Showing {(currentPage - 1) * logsPerPage + 1} to{" "}
                        {Math.min(currentPage * logsPerPage, totalLogs)} of {totalLogs} logs
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={
                                  currentPage === page
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    : "border-slate-600 text-slate-300 hover:bg-slate-700"
                                }
                              >
                                {page}
                              </Button>
                            )
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

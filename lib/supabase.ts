import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are not set. Using mock data.")
}

// Create a single supabase client for the entire app
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export type Transaction = {
  id: number
  reference: string
  date: string
  description: string
  amount: number
  created_at: string
  provider: string
  transaction_type: string
  account_from: string
  account_to: string
  fee: number
  total_amount: number
  raw_payload: any
  user_id?: string
  category: string
  merchant: string
  note_to_user: string
  extracted_at: string
}

export type User = {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
}

export type TransactionFilters = {
  search?: string
  category?: string
  transaction_type?: string
  provider?: string
  merchant?: string
  date_from?: string
  date_to?: string
  amount_min?: number
  amount_max?: number
}

export type PaginationResult<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Auth functions
export async function signUp(email: string, password: string, fullName: string) {
  if (!supabase) throw new Error("Supabase not configured")

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  return { data, error }
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error("Supabase not configured")

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signOut() {
  if (!supabase) throw new Error("Supabase not configured")

  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Mock data for when Supabase is not configured
const mockTransactions: Transaction[] = [
  {
    id: 1,
    reference: "TRX-001",
    date: "2023-12-15",
    description: "Salary Payment",
    amount: 5000000,
    created_at: "2023-12-15T10:00:00",
    provider: "Bank Transfer",
    transaction_type: "income",
    account_from: "Company Account",
    account_to: "Personal Account",
    fee: 0,
    total_amount: 5000000,
    raw_payload: { note: "Monthly salary payment" },
    category: "Income",
    merchant: "PT. Company Indonesia",
    note_to_user: "Monthly salary payment received",
    extracted_at: "2023-12-15T10:00:00",
  },
  {
    id: 2,
    reference: "TRX-002",
    date: "2023-12-16",
    description: "Grocery Shopping",
    amount: -250000,
    created_at: "2023-12-16T14:30:00",
    provider: "Supermarket",
    transaction_type: "expense",
    account_from: "Personal Account",
    account_to: "Supermarket",
    fee: 2500,
    total_amount: 252500,
    raw_payload: { items: ["food", "household"] },
    category: "Food & Dining",
    merchant: "Superindo",
    note_to_user: "Weekly grocery shopping",
    extracted_at: "2023-12-16T14:30:00",
  },
  {
    id: 3,
    reference: "TRX-003",
    date: "2023-12-17",
    description: "Internet Bill",
    amount: -350000,
    created_at: "2023-12-17T09:15:00",
    provider: "ISP Provider",
    transaction_type: "expense",
    account_from: "Personal Account",
    account_to: "ISP Provider",
    fee: 0,
    total_amount: 350000,
    raw_payload: { period: "December 2023" },
    category: "Bills & Utilities",
    merchant: "Telkom Indonesia",
    note_to_user: "Monthly internet bill payment",
    extracted_at: "2023-12-17T09:15:00",
  },
  {
    id: 4,
    reference: "TRX-004",
    date: "2023-12-20",
    description: "Freelance Work",
    amount: 1500000,
    created_at: "2023-12-20T16:45:00",
    provider: "Client Payment",
    transaction_type: "income",
    account_from: "Client Account",
    account_to: "Personal Account",
    fee: 15000,
    total_amount: 1485000,
    raw_payload: { project: "Website Design" },
    category: "Income",
    merchant: "Freelance Client",
    note_to_user: "Payment for website design project",
    extracted_at: "2023-12-20T16:45:00",
  },
  {
    id: 5,
    reference: "TRX-005",
    date: "2023-12-22",
    description: "Restaurant Dinner",
    amount: -175000,
    created_at: "2023-12-22T19:30:00",
    provider: "Restaurant",
    transaction_type: "expense",
    account_from: "Credit Card",
    account_to: "Restaurant",
    fee: 0,
    total_amount: 175000,
    raw_payload: { location: "Downtown" },
    category: "Food & Dining",
    merchant: "Sushi Tei",
    note_to_user: "Dinner with friends",
    extracted_at: "2023-12-22T19:30:00",
  },
]

// Enhanced transaction fetching with proper pagination and filtering
export async function getTransactionsPaginated(
  page = 1,
  limit = 20,
  sortBy = "date",
  sortOrder = "desc",
  filters: TransactionFilters = {},
  userId?: string,
): Promise<PaginationResult<Transaction>> {
  // Use mock data if Supabase is not configured
  if (!supabase) {
    console.log("Using mock transaction data")
    let filteredData = [...mockTransactions]

    // Apply filters
    if (filters.search) {
      filteredData = filteredData.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(filters.search!.toLowerCase()) ||
          transaction.reference?.toLowerCase().includes(filters.search!.toLowerCase()) ||
          transaction.merchant?.toLowerCase().includes(filters.search!.toLowerCase()),
      )
    }

    if (filters.category) {
      filteredData = filteredData.filter((transaction) => transaction.category === filters.category)
    }

    if (filters.transaction_type) {
      filteredData = filteredData.filter((transaction) => transaction.transaction_type === filters.transaction_type)
    }

    if (filters.provider) {
      filteredData = filteredData.filter((transaction) => transaction.provider === filters.provider)
    }

    if (filters.merchant) {
      filteredData = filteredData.filter((transaction) => transaction.merchant === filters.merchant)
    }

    if (filters.date_from) {
      filteredData = filteredData.filter((transaction) => transaction.date >= filters.date_from!)
    }

    if (filters.date_to) {
      filteredData = filteredData.filter((transaction) => transaction.date <= filters.date_to!)
    }

    if (filters.amount_min !== undefined) {
      filteredData = filteredData.filter((transaction) => Math.abs(transaction.amount) >= filters.amount_min!)
    }

    if (filters.amount_max !== undefined) {
      filteredData = filteredData.filter((transaction) => Math.abs(transaction.amount) <= filters.amount_max!)
    }

    // Apply sorting
    filteredData.sort((a, b) => {
      const aValue = a[sortBy as keyof Transaction]
      const bValue = b[sortBy as keyof Transaction]

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Apply pagination
    const total = filteredData.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const data = filteredData.slice(offset, offset + limit)

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    }
  }

  // Build query with filters
  let query = supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .order(sortBy, { ascending: sortOrder === "asc" })

  if (userId) {
    query = query.eq("user_id", userId)
  }

  // Apply filters
  if (filters.search) {
    query = query.or(
      `description.ilike.%${filters.search}%,reference.ilike.%${filters.search}%,merchant.ilike.%${filters.search}%`,
    )
  }

  if (filters.category) {
    query = query.eq("category", filters.category)
  }

  if (filters.transaction_type) {
    query = query.eq("transaction_type", filters.transaction_type)
  }

  if (filters.provider) {
    query = query.eq("provider", filters.provider)
  }

  if (filters.merchant) {
    query = query.eq("merchant", filters.merchant)
  }

  if (filters.date_from) {
    query = query.gte("date", filters.date_from)
  }

  if (filters.date_to) {
    query = query.lte("date", filters.date_to)
  }

  if (filters.amount_min !== undefined) {
    query = query.or(`amount.gte.${filters.amount_min},amount.lte.${-filters.amount_min}`)
  }

  if (filters.amount_max !== undefined) {
    query = query.or(`amount.lte.${filters.amount_max},amount.gte.${-filters.amount_max}`)
  }

  // Apply pagination
  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching transactions:", error)
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  return {
    data: data as Transaction[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

// Get filter options dynamically from database
export async function getFilterOptions(userId?: string) {
  if (!supabase) {
    return {
      categories: ["Income", "Food & Dining", "Transportation", "Bills & Utilities", "Shopping", "Entertainment"],
      transaction_types: ["income", "expense"],
      providers: ["Bank Transfer", "Supermarket", "ISP Provider", "Restaurant"],
      merchants: ["PT. Company Indonesia", "Superindo", "Telkom Indonesia", "Sushi Tei"],
    }
  }

  let query = supabase.from("transactions").select("category, transaction_type, provider, merchant")

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching filter options:", error)
    return {
      categories: [],
      transaction_types: [],
      providers: [],
      merchants: [],
    }
  }

  // Extract unique values
  const categories = [...new Set(data.map((item) => item.category).filter(Boolean))].sort()
  const transaction_types = [...new Set(data.map((item) => item.transaction_type).filter(Boolean))].sort()
  const providers = [...new Set(data.map((item) => item.provider).filter(Boolean))].sort()
  const merchants = [...new Set(data.map((item) => item.merchant).filter(Boolean))].sort()

  return {
    categories,
    transaction_types,
    providers,
    merchants,
  }
}

// Legacy function for backward compatibility
export async function getTransactions(
  limit = 10,
  offset = 0,
  sortBy = "date",
  sortOrder = "desc",
  filter?: { column: string; value: string },
  userId?: string,
) {
  const page = Math.floor(offset / limit) + 1
  const filters: TransactionFilters = {}

  if (filter) {
    if (filter.column === "description") {
      filters.search = filter.value
    } else {
      filters[filter.column as keyof TransactionFilters] = filter.value as any
    }
  }

  const result = await getTransactionsPaginated(page, limit, sortBy, sortOrder, filters, userId)
  return result.data
}

export async function getTransactionById(id: number, userId?: string) {
  // Use mock data if Supabase is not configured
  if (!supabase) {
    return mockTransactions.find((t) => t.id === id) || null
  }

  let query = supabase.from("transactions").select("*").eq("id", id)

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query.single()

  if (error) {
    console.error("Error fetching transaction:", error)
    return null
  }

  return data as Transaction
}

export async function getTransactionStats(userId?: string) {
  // Use mock data if Supabase is not configured
  if (!supabase) {
    const income = mockTransactions.filter((t) => t.transaction_type === "income").reduce((sum, t) => sum + t.amount, 0)

    const expense = Math.abs(
      mockTransactions.filter((t) => t.transaction_type === "expense").reduce((sum, t) => sum + t.amount, 0),
    )

    return { income, expense }
  }

  let incomeQuery = supabase.from("transactions").select("amount").eq("transaction_type", "income").gt("amount", 0)

  let expenseQuery = supabase.from("transactions").select("amount").eq("transaction_type", "expense").lt("amount", 0)

  if (userId) {
    incomeQuery = incomeQuery.eq("user_id", userId)
    expenseQuery = expenseQuery.eq("user_id", userId)
  }

  const [{ data: totalIncome, error: incomeError }, { data: totalExpense, error: expenseError }] = await Promise.all([
    incomeQuery,
    expenseQuery,
  ])

  if (incomeError || expenseError) {
    console.error("Error fetching stats:", incomeError || expenseError)
    return { income: 0, expense: 0 }
  }

  const income = totalIncome?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0
  const expense = Math.abs(totalExpense?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0)

  return { income, expense }
}

export async function getRecentProviders(userId?: string) {
  // Use mock data if Supabase is not configured
  if (!supabase) {
    const providerCounts = mockTransactions.reduce(
      (acc, transaction) => {
        if (transaction.provider) {
          acc[transaction.provider] = (acc[transaction.provider] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(providerCounts)
      .map(([provider, count]) => ({ provider, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  let query = supabase.from("transactions").select("provider").not("provider", "is", null)

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching providers:", error)
    return []
  }

  // Count providers manually
  const providerCounts = data.reduce((acc: Record<string, number>, item) => {
    if (item.provider) {
      acc[item.provider] = (acc[item.provider] || 0) + 1
    }
    return acc
  }, {})

  return Object.entries(providerCounts)
    .map(([provider, count]) => ({ provider, count }))
    .sort((a, b) => b - a)
    .slice(0, 5)
}

// Dynamic analytics functions that adapt to actual data
export async function getTimeSeriesData(
  timeframe: "daily" | "weekly" | "monthly" = "monthly",
  userId?: string,
  limit = 12,
) {
  if (!supabase) {
    // Mock data based on timeframe
    const mockData = []
    for (let i = limit - 1; i >= 0; i--) {
      const date = new Date()
      if (timeframe === "daily") {
        date.setDate(date.getDate() - i)
      } else if (timeframe === "weekly") {
        date.setDate(date.getDate() - i * 7)
      } else {
        date.setMonth(date.getMonth() - i)
      }

      mockData.push({
        period:
          timeframe === "daily"
            ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : timeframe === "weekly"
              ? `Week ${limit - i}`
              : date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        income: Math.random() * 2000000 + 500000,
        expense: Math.random() * 1500000 + 300000,
      })
    }
    return mockData
  }

  // Calculate date range based on timeframe
  const endDate = new Date()
  const startDate = new Date()

  if (timeframe === "daily") {
    startDate.setDate(startDate.getDate() - limit)
  } else if (timeframe === "weekly") {
    startDate.setDate(startDate.getDate() - limit * 7)
  } else {
    startDate.setMonth(startDate.getMonth() - limit)
  }

  let query = supabase
    .from("transactions")
    .select("date, amount, transaction_type")
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0])

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching time series data:", error)
    return []
  }

  // Group data by time period
  const groupedData = data.reduce((acc: Record<string, { income: number; expense: number }>, transaction) => {
    const date = new Date(transaction.date)
    let period: string

    if (timeframe === "daily") {
      period = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } else if (timeframe === "weekly") {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      period = `Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    } else {
      period = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    }

    if (!acc[period]) {
      acc[period] = { income: 0, expense: 0 }
    }

    if (transaction.transaction_type === "income") {
      acc[period].income += transaction.amount
    } else {
      acc[period].expense += Math.abs(transaction.amount)
    }

    return acc
  }, {})

  return Object.entries(groupedData)
    .map(([period, data]) => ({ period, ...data }))
    .sort((a, b) => a.period.localeCompare(b.period))
}

// Dynamic category analysis based on actual data
export async function getCategoryAnalysis(userId?: string) {
  if (!supabase) {
    return [
      { category: "Food & Dining", amount: 850000, percentage: 25, count: 12 },
      { category: "Transportation", amount: 680000, percentage: 20, count: 8 },
      { category: "Shopping", amount: 510000, percentage: 15, count: 6 },
      { category: "Bills & Utilities", amount: 680000, percentage: 20, count: 4 },
      { category: "Entertainment", amount: 340000, percentage: 10, count: 5 },
      { category: "Others", amount: 340000, percentage: 10, count: 3 },
    ]
  }

  let query = supabase
    .from("transactions")
    .select("category, amount")
    .eq("transaction_type", "expense")
    .not("category", "is", null)

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching category data:", error)
    return []
  }

  // Group by category
  const categoryData = data.reduce((acc: Record<string, { amount: number; count: number }>, transaction) => {
    const category = transaction.category || "Others"

    if (!acc[category]) {
      acc[category] = { amount: 0, count: 0 }
    }

    acc[category].amount += Math.abs(transaction.amount)
    acc[category].count += 1

    return acc
  }, {})

  const total = Object.values(categoryData).reduce((sum, cat) => sum + cat.amount, 0)

  return Object.entries(categoryData)
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count,
      percentage: Math.round((data.amount / total) * 100),
    }))
    .sort((a, b) => b.amount - a.amount)
}

// Legacy functions for backward compatibility
export async function getMonthlyTransactionData(userId?: string) {
  return getTimeSeriesData("monthly", userId, 12)
}

export async function getDailyTransactionData(userId?: string) {
  return getTimeSeriesData("daily", userId, 30)
}

export async function getWeeklyTransactionData(userId?: string) {
  return getTimeSeriesData("weekly", userId, 12)
}

export async function getCategoryData(userId?: string) {
  const analysis = await getCategoryAnalysis(userId)
  return analysis.map(({ count, ...rest }) => rest) // Remove count for backward compatibility
}

export type EmailSettings = {
  id: number
  email_user: string
  email_pass: string
  imap_host: string
  imap_port: number
  active: boolean
  created_at: string
  user_id: string
}

export type EmailLog = {
  id: number
  account_id: number
  user_id: string
  status: string
  message: string | null
  created_at: string
}

export type TransactionRoast = {
  id: number
  user_id: string
  roast_type: string
  roast_time: string
  roast_text: string
  tx_ids: number[]
  created_at: string
}

// Email Settings functions
export async function getEmailSettings(userId: string): Promise<EmailSettings | null> {
  if (!supabase) return null

  const { data, error } = await supabase.from("email_transactions").select("*").eq("user_id", userId).single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found
      return null
    }
    throw error
  }

  return data as EmailSettings
}

export async function saveEmailSettings(
  userId: string,
  settings: Omit<EmailSettings, "id" | "created_at" | "user_id">,
) {
  if (!supabase) throw new Error("Supabase not configured")

  // Check if settings already exist
  const existing = await getEmailSettings(userId)

  if (existing) {
    // Update existing settings
    const { error } = await supabase.from("email_transactions").update(settings).eq("user_id", userId)

    if (error) throw error
  } else {
    // Insert new settings
    const { error } = await supabase.from("email_transactions").insert({ ...settings, user_id: userId })

    if (error) throw error
  }
}

// Email Logs functions
export async function getEmailLogs(
  userId: string,
  page = 1,
  limit = 10,
  search?: string,
  status?: string,
): Promise<{ logs: EmailLog[]; total: number }> {
  if (!supabase) {
    // Return mock data for demo
    const mockLogs: EmailLog[] = [
      {
        id: 1,
        account_id: 1,
        user_id: userId,
        status: "success",
        message: "Email processed successfully",
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        account_id: 1,
        user_id: userId,
        status: "error",
        message: "Failed to connect to IMAP server",
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        account_id: 1,
        user_id: userId,
        status: "warning",
        message: "No new emails found",
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
    ]

    let filteredLogs = mockLogs

    if (search) {
      filteredLogs = filteredLogs.filter(
        (log) =>
          log.message?.toLowerCase().includes(search.toLowerCase()) ||
          log.status.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (status) {
      filteredLogs = filteredLogs.filter((log) => log.status === status)
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      logs: filteredLogs.slice(startIndex, endIndex),
      total: filteredLogs.length,
    }
  }

  let query = supabase
    .from("email_logs")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (search) {
    query = query.or(`message.ilike.%${search}%,status.ilike.%${search}%`)
  }

  if (status) {
    query = query.eq("status", status)
  }

  const startIndex = (page - 1) * limit
  query = query.range(startIndex, startIndex + limit - 1)

  const { data, error, count } = await query

  if (error) throw error

  return {
    logs: data as EmailLog[],
    total: count || 0,
  }
}

export async function getLatestRoasts(userId?: string, limit = 5): Promise<TransactionRoast[]> {
  if (!supabase) {
    // Mock data untuk demo
    return [
      {
        id: 1,
        user_id: userId || "mock",
        roast_type: "spending_spree",
        roast_time: new Date().toISOString(),
        roast_text:
          "Wow, your wallet is crying! 😭 You spent more on coffee this week than some people spend on groceries. Maybe it's time to learn how to make coffee at home? ☕️💸",
        tx_ids: [1, 2, 3],
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        user_id: userId || "mock",
        roast_type: "income_flex",
        roast_time: new Date(Date.now() - 86400000).toISOString(),
        roast_text:
          "Look at you, money magnet! 🧲💰 Your income game is so strong, even your bank account is doing a happy dance. Keep it up, financial wizard! ✨",
        tx_ids: [4, 5],
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        user_id: userId || "mock",
        roast_type: "budget_reality",
        roast_time: new Date(Date.now() - 172800000).toISOString(),
        roast_text:
          "Your budget planning skills are... interesting 🤔 You budgeted for essentials but somehow ended up buying 3 different streaming subscriptions. Netflix, Disney+, AND Spotify? Living the dream! 🎬🎵",
        tx_ids: [6, 7, 8],
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ]
  }

  let query = supabase.from("transaction_roasts").select("*").order("created_at", { ascending: false }).limit(limit)

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching roasts:", error)
    return []
  }

  return data as TransactionRoast[]
}

export async function getRoastById(id: number, userId?: string): Promise<TransactionRoast | null> {
  if (!supabase) {
    const mockRoasts = await getLatestRoasts(userId)
    return mockRoasts.find((r) => r.id === id) || null
  }

  let query = supabase.from("transaction_roasts").select("*").eq("id", id)

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query.single()

  if (error) {
    console.error("Error fetching roast:", error)
    return null
  }

  return data as TransactionRoast
}

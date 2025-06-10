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
}

export type User = {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
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
  },
]

export async function getTransactions(
  limit = 10,
  offset = 0,
  sortBy = "date",
  sortOrder = "desc",
  filter?: { column: string; value: string },
  userId?: string,
) {
  // Use mock data if Supabase is not configured
  if (!supabase) {
    console.log("Using mock transaction data")
    let filteredData = [...mockTransactions]

    // Apply filter if provided
    if (filter) {
      filteredData = filteredData.filter((transaction) =>
        transaction[filter.column as keyof Transaction]?.toString().toLowerCase().includes(filter.value.toLowerCase()),
      )
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
    return filteredData.slice(offset, offset + limit)
  }

  let query = supabase
    .from("transactions")
    .select("*")
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(offset, offset + limit - 1)

  if (userId) {
    query = query.eq("user_id", userId)
  }

  if (filter) {
    query = query.ilike(filter.column, `%${filter.value}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching transactions:", error)
    return []
  }

  return data as Transaction[]
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

export async function getMonthlyTransactionData(userId?: string) {
  if (!supabase) {
    // Mock monthly data
    return [
      { month: "Jan", income: 6500000, expense: 3200000 },
      { month: "Feb", income: 5800000, expense: 2900000 },
      { month: "Mar", income: 7200000, expense: 3800000 },
      { month: "Apr", income: 6100000, expense: 3100000 },
      { month: "May", income: 6800000, expense: 3500000 },
      { month: "Jun", income: 7500000, expense: 4200000 },
    ]
  }

  let query = supabase
    .from("transactions")
    .select("date, amount, transaction_type")
    .gte("date", new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0])

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching monthly data:", error)
    return []
  }

  // Group by month
  const monthlyData = data.reduce((acc: Record<string, { income: number; expense: number }>, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString("en-US", { month: "short" })

    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 }
    }

    if (transaction.transaction_type === "income") {
      acc[month].income += transaction.amount
    } else {
      acc[month].expense += Math.abs(transaction.amount)
    }

    return acc
  }, {})

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
  }))
}

export async function getCategoryData(userId?: string) {
  if (!supabase) {
    return [
      { category: "Food & Dining", amount: 850000, percentage: 25 },
      { category: "Transportation", amount: 680000, percentage: 20 },
      { category: "Shopping", amount: 510000, percentage: 15 },
      { category: "Bills & Utilities", amount: 680000, percentage: 20 },
      { category: "Entertainment", amount: 340000, percentage: 10 },
      { category: "Others", amount: 340000, percentage: 10 },
    ]
  }

  let query = supabase.from("transactions").select("description, amount").eq("transaction_type", "expense")

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching category data:", error)
    return []
  }

  // Simple categorization based on description keywords
  const categories: Record<string, number> = {}
  const categoryKeywords = {
    "Food & Dining": ["restaurant", "food", "grocery", "cafe", "coffee", "dinner", "lunch"],
    Transportation: ["transport", "taxi", "uber", "grab", "fuel", "parking"],
    Shopping: ["shopping", "store", "mall", "online", "purchase"],
    "Bills & Utilities": ["bill", "electric", "water", "internet", "phone", "utility"],
    Entertainment: ["movie", "game", "entertainment", "music", "streaming"],
  }

  data.forEach((transaction) => {
    let categorized = false
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => transaction.description.toLowerCase().includes(keyword))) {
        categories[category] = (categories[category] || 0) + Math.abs(transaction.amount)
        categorized = true
        break
      }
    }
    if (!categorized) {
      categories["Others"] = (categories["Others"] || 0) + Math.abs(transaction.amount)
    }
  })

  const total = Object.values(categories).reduce((sum, amount) => sum + amount, 0)

  return Object.entries(categories).map(([category, amount]) => ({
    category,
    amount,
    percentage: Math.round((amount / total) * 100),
  }))
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

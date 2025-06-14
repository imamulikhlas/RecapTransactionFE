import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatCurrency } from "@/lib/utils/utils";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    position: "relative",
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  watermark: {
    position: "absolute",
    top: "35%",
    left: "10%",
    opacity: 0.05,
    fontSize: 100,
    transform: "rotate(-30deg)",
    color: "#000",
  },
  logo: {
    width: 100,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subHeader: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#222",
    borderBottom: "1 solid #ccc",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#999",
  },
  transactionList: {
    marginTop: 8,
  },
  transactionItem: {
    marginBottom: 4,
    paddingBottom: 4,
    borderBottom: "0.5 solid #eee",
  },
  transactionDetails: {
    fontSize: 11,
    color: "#444",
  },
  transactionMeta: {
    fontSize: 10,
    color: "#888",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 80,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontSize: 10,
    color: "gray",
  },
});

interface AnalyticsPDFProps {
  stats: {
    income: number;
    expense: number;
  };
  timeRangeLabel: string;
  chartData: any[];
  categoryData: any[];
  // transactions hanya ambil field penting
  transactions: Array<{
    date: string;
    note_to_user?: string;
    description?: string;
    merchant?: string;
    amount: number;
    transaction_type: string;
  }>;
  logoUrl?: string;
}

export default function AnalyticsReportPDF({
  stats,
  chartData,
  categoryData,
  transactions,
  timeRangeLabel,
  logoUrl,
}: AnalyticsPDFProps) {
  const netIncome = stats.income - stats.expense;
  const savingsRate = stats.income > 0 ? (netIncome / stats.income) * 100 : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>RAHASIA</Text>
        <View style={styles.headerRow}>
          {logoUrl && <Image style={styles.logo} src={logoUrl} />}
          <View style={styles.headerRight}>
            <Text style={styles.headerText}>TRANSACTION HUB - by IMAM</Text>
            <Text style={styles.email}>imamulikhlas@gmail.com</Text>
          </View>
        </View>
        <Text style={styles.subHeader}>Your Financial Summary Report</Text>

        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Period:</Text>
            <Text>{timeRangeLabel}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Income:</Text>
            <Text>{formatCurrency(stats.income)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Expenses:</Text>
            <Text>{formatCurrency(stats.expense)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Net Income:</Text>
            <Text>{formatCurrency(netIncome)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Savings Rate:</Text>
            <Text>{savingsRate.toFixed(1)}%</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {categoryData.map((cat, idx) => (
            <View key={idx} style={styles.row}>
              <Text>
                {cat.category} ({cat.count}x)
              </Text>
              <Text>
                {formatCurrency(cat.amount)} ({cat.percentage}%)
              </Text>
            </View>
          ))}
        </View>

        {/* Time Series Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Series Summary</Text>
          {chartData.map((d, idx) => (
            <View key={idx} style={styles.row}>
              <Text>{d.period}</Text>
              <Text>
                Income: {formatCurrency(d.income)} | Expense:{" "}
                {formatCurrency(d.expense)}
              </Text>
            </View>
          ))}
        </View>

        {/* Transaction Records */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Records</Text>
          <View style={styles.transactionList}>
            {transactions.map((tx, idx) => {
              // hanya ambil tanggal (YYYY-MM-DD)
              const dateOnly = tx.date.split("T")[0];
              // pilih deskripsi: note_to_user > description > merchant
              const desc =
                tx.note_to_user ||
                tx.description ||
                tx.merchant ||
                "No description";
              return (
                <View key={idx} style={styles.transactionItem}>
                  <Text style={styles.transactionDetails}>
                    {dateOnly} - {desc}
                  </Text>
                  <Text style={styles.transactionMeta}>
                    {formatCurrency(tx.amount)} • {tx.transaction_type}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.footer}>
          Generated by PT IMAM MANTAP • Confidential Document
        </Text>
      </Page>
    </Document>
  );
}

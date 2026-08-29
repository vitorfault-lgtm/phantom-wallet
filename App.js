import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* ------------------------------------------------------------------ */
/*  THEME  — Phantom dark palette                                     */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#000000",
  card: "#1c1c1e",
  cardAlt: "#2c2c2e",
  chip: "#1c1c1e",
  text: "#ffffff",
  sub: "#8e8e93",
  purple: "#ab9ff2",
  purpleDark: "#4a4458",
  green: "#3ddc84",
  red: "#ff5c5c",
  hairline: "#2a2a2c",
};

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */
const HOLDINGS = [
  { sym: "USDT", name: "Tether USD", amount: "50,000", usd: "$50,000.00", change: "+0.01%", up: true, color: "#26a17b", glyph: "₮" },
  { sym: "SOL", name: "Solana", amount: "0", usd: "$0.00", change: "+2.44%", up: true, color: "#000000", glyph: "◎" },
  { sym: "BTC", name: "Bitcoin", amount: "0", usd: "$0.00", change: "-2.56%", up: false, color: "#f7931a", glyph: "₿" },
  { sym: "ETH", name: "Ethereum", amount: "0", usd: "$0.00", change: "-2.44%", up: false, color: "#627eea", glyph: "Ξ" },
];

const TRENDING = [
  { sym: "PINK", mc: "$2.3M MC", price: "$0.00234", change: "+76.84%", up: true, color: "#ff2fb9" },
  { sym: "ANTFUN", mc: "$91M MC", price: "$0.04842", change: "+1.93%", up: true, color: "#ff7a3c" },
  { sym: "HNT", mc: "$55M MC", price: "$0.29787", change: "+33.00%", up: true, color: "#474dff" },
];

const ACTIVITY = [
  { type: "Received", detail: "From 4FGEZo…BmmgSF", amount: "+50,000 USDT", up: true, icon: "arrow-down" },
  { type: "Swapped", detail: "SOL → USDT", amount: "-0.5 SOL", up: false, icon: "swap-horizontal" },
  { type: "Sent", detail: "To @vitorfault", amount: "-120 USDT", up: false, icon: "arrow-up" },
  { type: "Received", detail: "From Coinbase", amount: "+1,000 USDT", up: true, icon: "arrow-down" },
];

/* ------------------------------------------------------------------ */
/*  SHARED PIECES                                                     */
/* ------------------------------------------------------------------ */
function TokenIcon({ color, glyph, size = 44 }) {
  return (
    <View style={[styles.tokenIcon, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={{ color: "#fff", fontWeight: "700", fontSize: size * 0.45 }}>{glyph}</Text>
    </View>
  );
}

function TokenRow({ item, showAmount }) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.tokenRow}>
      <TokenIcon color={item.color} glyph={item.glyph} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.tokenSym}>{item.sym}</Text>
        <Text style={styles.tokenSub}>{showAmount ? `${item.amount} ${item.sym}` : item.mc}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.tokenPrice}>{showAmount ? item.usd : item.price}</Text>
        <Text style={[styles.tokenChange, { color: item.up ? C.green : C.red }]}>{item.change}</Text>
      </View>
    </TouchableOpacity>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME SCREEN                                                       */
/* ------------------------------------------------------------------ */
function HomeScreen() {
  const actions = [
    { label: "Receive", icon: "qr-code-outline" },
    { label: "Send", icon: "paper-plane-outline" },
    { label: "Swap", icon: "swap-horizontal" },
    { label: "Buy", icon: "card-outline" },
  ];
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Balance */}
      <View style={styles.balanceWrap}>
        <Text style={styles.balanceLabel}>Account 1</Text>
        <Text style={styles.balanceValue}>$50,000.00</Text>
        <Text style={styles.balanceChange}>+$0.00  (0.00%)  Today</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        {actions.map((a) => (
          <TouchableOpacity key={a.label} style={styles.actionBtn} activeOpacity={0.7}>
            <View style={styles.actionCircle}>
              <Ionicons name={a.icon} size={24} color={C.purple} />
            </View>
            <Text style={styles.actionLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Holdings */}
      <View style={styles.section}>
        {HOLDINGS.map((t) => (
          <TokenRow key={t.sym} item={t} showAmount />
        ))}
      </View>

      {/* Trending */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending</Text>
        <Ionicons name="chevron-forward" size={20} color={C.text} />
      </View>
      <View style={styles.section}>
        {TRENDING.map((t) => (
          <TokenRow key={t.sym} item={t} />
        ))}
      </View>
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/*  COLLECTIBLES (NFT) SCREEN                                         */
/* ------------------------------------------------------------------ */
function CollectiblesScreen() {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyGlyph}>
        <Ionicons name="images-outline" size={40} color={C.purple} />
      </View>
      <Text style={styles.emptyTitle}>No collectibles yet</Text>
      <Text style={styles.emptySub}>NFTs you receive or mint will show up here.</Text>
      <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
        <Text style={styles.primaryBtnText}>Explore Collections</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  SWAP SCREEN                                                       */
/* ------------------------------------------------------------------ */
function SwapScreen() {
  const [amount, setAmount] = useState("0");

  const press = (k) => {
    setAmount((prev) => {
      if (k === "back") return prev.length <= 1 ? "0" : prev.slice(0, -1);
      if (k === ".") return prev.includes(".") ? prev : prev + ".";
      if (prev === "0") return k;
      return prev + k;
    });
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        {/* You Pay */}
        <View style={styles.swapCard}>
          <Text style={styles.swapLabel}>You Pay</Text>
          <View style={styles.swapRow}>
            <Text style={styles.swapAmount}>{amount}</Text>
            <View style={styles.swapPill}>
              <TokenIcon color="#000" glyph="◎" size={26} />
              <Text style={styles.swapPillText}>SOL</Text>
              <Ionicons name="chevron-down" size={18} color={C.sub} />
            </View>
          </View>
          <Text style={styles.swapFoot}>{"< 0.00001 SOL"}</Text>
        </View>

        {/* Swap toggle */}
        <View style={styles.swapToggleWrap}>
          <View style={styles.swapToggle}>
            <Ionicons name="swap-vertical" size={22} color="#000" />
          </View>
        </View>

        {/* You Receive */}
        <View style={styles.swapCard}>
          <Text style={styles.swapLabel}>You Receive</Text>
          <View style={styles.swapRow}>
            <Text style={styles.swapAmount}>0</Text>
            <View style={styles.swapPill}>
              <View style={[styles.tokenIcon, { width: 26, height: 26, borderRadius: 13, backgroundColor: C.purple }]}>
                <Ionicons name="cash-outline" size={14} color="#000" />
              </View>
              <Text style={styles.swapPillText}>Cash</Text>
              <Ionicons name="chevron-down" size={18} color={C.sub} />
            </View>
          </View>
          <Text style={styles.swapFoot}>$0.00</Text>
        </View>

        {/* Quick % */}
        <View style={styles.pctRow}>
          {["25%", "50%", "Sell all"].map((p) => (
            <TouchableOpacity key={p} style={styles.pctChip} activeOpacity={0.7}>
              <Text style={styles.pctText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {keys.map((k) => (
          <TouchableOpacity key={k} style={styles.key} onPress={() => press(k)} activeOpacity={0.6}>
            {k === "back" ? (
              <Ionicons name="backspace-outline" size={26} color={C.text} />
            ) : (
              <Text style={styles.keyText}>{k}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  ACTIVITY SCREEN                                                   */
/* ------------------------------------------------------------------ */
function ActivityScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}>
      <View style={styles.section}>
        {ACTIVITY.map((a, i) => (
          <View key={i} style={styles.tokenRow}>
            <View style={[styles.actionCircle, { backgroundColor: C.card, width: 44, height: 44, borderRadius: 22 }]}>
              <Ionicons name={a.icon} size={22} color={a.up ? C.green : C.text} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.tokenSym}>{a.type}</Text>
              <Text style={styles.tokenSub}>{a.detail}</Text>
            </View>
            <Text style={[styles.tokenPrice, { color: a.up ? C.green : C.text }]}>{a.amount}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/*  SETTINGS SCREEN                                                   */
/* ------------------------------------------------------------------ */
function SettingsScreen() {
  const items = [
    { label: "Profile", icon: "person-outline" },
    { label: "Chats", icon: "chatbubble-outline" },
    { label: "Watchlist", icon: "heart-outline" },
    { label: "History", icon: "time-outline" },
    { label: "Settings", icon: "settings-outline" },
    { label: "Help & Support", icon: "information-circle-outline" },
  ];
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarLg}>
          <Text style={{ fontSize: 30 }}>{"🥰"}</Text>
        </View>
        <Text style={styles.handle}>@vitorfault</Text>
        <View style={styles.xRow}>
          <Ionicons name="logo-twitter" size={16} color={C.purple} />
          <Text style={styles.xText}>Connect your X account</Text>
        </View>
      </View>

      {/* Account switcher */}
      <TouchableOpacity style={styles.accountRow} activeOpacity={0.7}>
        <View style={styles.accountBadge}>
          <Text style={{ color: C.text, fontWeight: "700" }}>A1</Text>
        </View>
        <Text style={styles.accountText}>Account 1</Text>
        <Ionicons name="chevron-down" size={20} color={C.text} />
      </TouchableOpacity>

      {/* Menu */}
      <View style={{ marginTop: 8 }}>
        {items.map((it) => (
          <TouchableOpacity key={it.label} style={styles.menuRow} activeOpacity={0.7}>
            <Ionicons name={it.icon} size={24} color={C.text} />
            <Text style={styles.menuText}>{it.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOT — custom tab bar                                             */
/* ------------------------------------------------------------------ */
const TABS = [
  { key: "home", label: "Home", icon: "home", Screen: HomeScreen, title: "Home" },
  { key: "nft", label: "NFTs", icon: "images", Screen: CollectiblesScreen, title: "Collectibles" },
  { key: "swap", label: "Swap", icon: "swap-horizontal", Screen: SwapScreen, title: "Swap" },
  { key: "activity", label: "Activity", icon: "pulse", Screen: ActivityScreen, title: "Activity" },
  { key: "settings", label: "Settings", icon: "person", Screen: SettingsScreen, title: "Settings" },
];

export default function App() {
  const [active, setActive] = useState("home");
  const current = TABS.find((t) => t.key === active);
  const Screen = current.Screen;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.avatarSm} activeOpacity={0.7}>
          <Text style={{ fontSize: 18 }}>{"🥰"}</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>{current.title}</Text>
        <TouchableOpacity style={styles.avatarSm} activeOpacity={0.7}>
          <Ionicons name="scan-outline" size={20} color={C.text} />
        </TouchableOpacity>
      </View>

      {/* Screen */}
      <View style={{ flex: 1 }}>
        <Screen />
      </View>

      {/* Bottom tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((t) => {
          const focused = t.key === active;
          return (
            <TouchableOpacity key={t.key} style={styles.tabItem} onPress={() => setActive(t.key)} activeOpacity={0.7}>
              <Ionicons name={focused ? t.icon : `${t.icon}-outline`} size={24} color={focused ? C.purple : C.sub} />
              <Text style={[styles.tabLabel, { color: focused ? C.purple : C.sub }]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/*  STYLES                                                            */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  /* Top bar */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topTitle: { color: C.text, fontSize: 18, fontWeight: "700" },
  avatarSm: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Balance */
  balanceWrap: { alignItems: "center", paddingVertical: 24 },
  balanceLabel: { color: C.sub, fontSize: 15, marginBottom: 6 },
  balanceValue: { color: C.text, fontSize: 44, fontWeight: "800", letterSpacing: -1 },
  balanceChange: { color: C.green, fontSize: 15, marginTop: 8, fontWeight: "600" },

  /* Actions */
  actionsRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 16, marginBottom: 24 },
  actionBtn: { alignItems: "center" },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionLabel: { color: C.text, fontSize: 13, fontWeight: "600" },

  /* Sections */
  section: { paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: { color: C.text, fontSize: 24, fontWeight: "800", marginRight: 6 },

  /* Token row */
  tokenRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  tokenIcon: { alignItems: "center", justifyContent: "center" },
  tokenSym: { color: C.text, fontSize: 17, fontWeight: "700" },
  tokenSub: { color: C.sub, fontSize: 14, marginTop: 2 },
  tokenPrice: { color: C.text, fontSize: 16, fontWeight: "700" },
  tokenChange: { fontSize: 14, marginTop: 2, fontWeight: "600" },

  /* Empty state */
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  emptyGlyph: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: { color: C.text, fontSize: 22, fontWeight: "800", marginBottom: 8 },
  emptySub: { color: C.sub, fontSize: 15, textAlign: "center", lineHeight: 22 },
  primaryBtn: {
    marginTop: 28,
    backgroundColor: C.purple,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  primaryBtnText: { color: "#000", fontSize: 17, fontWeight: "700" },

  /* Swap */
  swapCard: { backgroundColor: C.card, borderRadius: 20, padding: 20, marginBottom: 6 },
  swapLabel: { color: C.sub, fontSize: 16, marginBottom: 12 },
  swapRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  swapAmount: { color: C.text, fontSize: 40, fontWeight: "300" },
  swapPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.cardAlt,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  swapPillText: { color: C.text, fontSize: 17, fontWeight: "700", marginHorizontal: 8 },
  swapFoot: { color: C.sub, fontSize: 15, textAlign: "right", marginTop: 12 },
  swapToggleWrap: { alignItems: "center", marginVertical: -4, zIndex: 2 },
  swapToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.purple,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: C.bg,
  },
  pctRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  pctChip: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 24,
    paddingVertical: 16,
    marginHorizontal: 4,
    alignItems: "center",
  },
  pctText: { color: C.text, fontSize: 17, fontWeight: "700" },

  /* Keypad */
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginTop: "auto",
  },
  key: { width: "33.33%", alignItems: "center", justifyContent: "center", paddingVertical: 16 },
  keyText: { color: C.text, fontSize: 28, fontWeight: "500" },

  /* Settings */
  profileHeader: { paddingHorizontal: 16, paddingVertical: 20 },
  avatarLg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  handle: { color: C.text, fontSize: 30, fontWeight: "800" },
  xRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  xText: { color: C.purple, fontSize: 16, fontWeight: "600", marginLeft: 8 },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  accountBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.cardAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  accountText: { color: C.text, fontSize: 20, fontWeight: "700", flex: 1 },
  menuRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 18 },
  menuText: { color: C.text, fontSize: 20, fontWeight: "600", marginLeft: 16 },

  /* Tab bar */
  tabBar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.hairline,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    backgroundColor: C.bg,
  },
  tabItem: { flex: 1, alignItems: "center" },
  tabLabel: { fontSize: 11, marginTop: 4, fontWeight: "600" },
});

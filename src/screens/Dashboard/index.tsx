import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDashboard } from './hooks/useDashboard';
import { StatCard } from './components/StatCard';
import { TransactionChart } from './components/TransactionChart';
import { RecentActivity } from './components/RecentActivity';
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonActivity,
} from './components/SkeletonLoader';

export default function DashboardScreen() {
  const { loading, data, refresh } = useDashboard();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1120" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.orgName}>FinFlow Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
          <MaterialCommunityIcons name="bell-outline" size={22} color="#C9D5E8" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor="#4F8EF7"
            colors={['#4F8EF7']}
          />
        }
      >
        {/* ── Pending Reconciliation Banner ────────────────── */}
        {loading ? (
          <SkeletonCard />
        ) : (
          <TouchableOpacity style={styles.reconBanner} activeOpacity={0.85}>
            <View style={styles.reconLeft}>
              <View style={styles.reconIcon}>
                <MaterialCommunityIcons name="scale-balance" size={18} color="#FBBF24" />
              </View>
              <View>
                <Text style={styles.reconCount}>{data!.pendingReconciliation} pending</Text>
                <Text style={styles.reconSub}>Reconciliation items need review</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#FBBF24" />
          </TouchableOpacity>
        )}

        {/* ── Stat Cards ───────────────────────────────────── */}
        <View style={styles.statsRow}>
          {loading ? (
            <>
              <SkeletonCard />
              <View style={{ width: 12 }} />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                label="Today"
                value={data!.todayTotal.toLocaleString()}
                sub="transactions"
                icon="lightning-bolt"
                iconColor="#6EE7B7"
                iconBg="#0D2E22"
                trend={{ value: '+12%', up: true }}
              />
              <View style={{ width: 12 }} />
              <StatCard
                label="Weekly"
                value={data!.weeklyTotal.toLocaleString()}
                sub="transactions"
                icon="calendar-week"
                iconColor="#93C5FD"
                iconBg="#0D1E3B"
                trend={{ value: '+8%', up: true }}
              />
            </>
          )}
        </View>

        {/* ── Success / Failed Mini Cards ───────────────────── */}
        <View style={styles.statsRow}>
          {loading ? (
            <>
              <SkeletonCard />
              <View style={{ width: 12 }} />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                label="Success"
                value={data!.todaySuccess.toLocaleString()}
                icon="check-circle-outline"
                iconColor="#34D399"
                iconBg="#0D2E1B"
              />
              <View style={{ width: 12 }} />
              <StatCard
                label="Failed"
                value={data!.todayFailed.toLocaleString()}
                icon="alert-circle-outline"
                iconColor="#F87171"
                iconBg="#2E0D0D"
                trend={{ value: '-3%', up: false }}
              />
            </>
          )}
        </View>

        {/* ── Chart ─────────────────────────── */}
        {loading ? (
          <SkeletonChart />
        ) : (
          <TransactionChart data={data!.chartData} />
        )}

        {/* ── Recent Activity ──────────────────────────────── */}
        {loading ? (
          <View style={styles.activityCard}>
            <SkeletonActivity />
            <SkeletonActivity />
            <SkeletonActivity />
          </View>
        ) : (
          <RecentActivity data={data!.recentActivity} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#0B1120',
  },
  greeting: {
    fontSize: 13,
    color: '#7A8499',
    fontWeight: '500',
    marginBottom: 2,
  },
  orgName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#111C2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F87171',
    borderWidth: 1.5,
    borderColor: '#111C2E',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  reconBanner: {
    backgroundColor: '#1C1A0D',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3D3410',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reconLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reconIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2E250D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reconCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FBBF24',
  },
  reconSub: {
    fontSize: 11,
    color: '#7A6830',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
  },
  activityCard: {
    backgroundColor: '#111C2E',
    borderRadius: 16,
    padding: 18,
  },
});

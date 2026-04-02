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
import { useNavigation } from '@react-navigation/native';
import { useDashboard } from './hooks/useDashboard';
import { StatCard } from './components/StatCard';
import { TransactionChart } from './components/TransactionChart';
import { RecentActivity } from './components/RecentActivity';
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonActivity,
} from './components/SkeletonLoader';
import { useTheme } from '../../store/ThemeContext';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { loading, data, refresh } = useDashboard();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();


  return (
    <View style={[styles.root, { backgroundColor: colors.bgBase }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bgBase}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.bgBase }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textMuted }]}>Good Morning</Text>
          <Text style={[styles.orgName, { color: colors.textPrimary }]}>FinFlow Dashboard</Text>
        </View>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.bgCard }]} activeOpacity={0.8}>
          <MaterialCommunityIcons name="bell-outline" size={22} color={colors.textSecondary} />
          <View style={[styles.badge, { backgroundColor: colors.badgeBg, borderColor: colors.bgCard }]} />
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
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        {/* ── Pending Reconciliation Banner ────────────────── */}
        {(loading || !data) ? (
          <SkeletonCard />
        ) : (
          <TouchableOpacity
            style={[
              styles.reconBanner,
              { backgroundColor: colors.pendingBg, borderColor: colors.pendingFg + '40' },
            ]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Reconciliation')}
          >
            <View style={styles.reconLeft}>
              <View style={[styles.reconIcon, { backgroundColor: colors.pendingBg }]}>
                <MaterialCommunityIcons name="scale-balance" size={18} color={colors.pendingFg} />
              </View>
              <View>
                <Text style={[styles.reconCount, { color: colors.pendingFg }]}>
                  {(data?.pendingReconciliation || 0)} pending
                </Text>
                <Text style={[styles.reconSub, { color: colors.pendingFg + 'AA' }]}>
                  Reconciliation items need review
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.pendingFg} />
          </TouchableOpacity>
        )}

        {/* ── Stat Cards ───────────────────────────────────── */}
        <View style={styles.statsRow}>
          {(loading || !data) ? (
            <>
              <SkeletonCard />
              <View style={{ width: 12 }} />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                label="Today"
                value={(data?.todayTotal || 0).toLocaleString()}
                sub="transactions"
                icon="lightning-bolt"
                iconColor="#6EE7B7"
                iconBg={colors.successBg}
                trend={{ value: '+12%', up: true }}
              />
              <View style={{ width: 12 }} />
              <StatCard
                label="Weekly"
                value={(data?.weeklyTotal || 0).toLocaleString()}
                sub="transactions"
                icon="calendar-week"
                iconColor="#93C5FD"
                iconBg={colors.bgMuted}
                trend={{ value: '+8%', up: true }}
              />
            </>
          )}
        </View>

        {/* ── Success / Failed Mini Cards ───────────────────── */}
        <View style={styles.statsRow}>
          {(loading || !data) ? (
            <>
              <SkeletonCard />
              <View style={{ width: 12 }} />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                label="Success"
                value={(data?.todaySuccess || 0).toLocaleString()}
                icon="check-circle-outline"
                iconColor={colors.successFg}
                iconBg={colors.successBg}
              />
              <View style={{ width: 12 }} />
              <StatCard
                label="Failed"
                value={(data?.todayFailed || 0).toLocaleString()}
                icon="alert-circle-outline"
                iconColor={colors.failedFg}
                iconBg={colors.failedBg}
                trend={{ value: '-3%', up: false }}
              />
            </>
          )}
        </View>

        {/* ── Chart ─────────────────────────── */}
        {(loading || !data) ? (
          <SkeletonChart />
        ) : (
          <TransactionChart data={data?.chartData || []} />
        )}

        {/* ── Recent Activity ──────────────────────────────── */}
        {(loading || !data) ? (
          <View style={[styles.activityCard, { backgroundColor: colors.bgCard }]}>
            <SkeletonActivity />
            <SkeletonActivity />
            <SkeletonActivity />
          </View>
        ) : (
          <RecentActivity data={data?.recentActivity || []} />
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  orgName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
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
    borderWidth: 1.5,
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
    borderRadius: 14,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  reconCount: {
    fontSize: 14,
    fontWeight: '700',
  },
  reconSub: {
    fontSize: 11,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
  },
  activityCard: {
    borderRadius: 16,
    padding: 18,
  },
});

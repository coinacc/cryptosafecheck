'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Activity, Clock, Database, TrendingUp, AlertCircle, Eye, EyeOff, LogOut } from 'lucide-react';

export default function AnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [realTimeStats, setRealTimeStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Check for existing authentication on page load
  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem('analytics_auth');
      if (authData) {
        try {
          const { timestamp, authenticated, rememberMe: savedRememberMe } = JSON.parse(authData);
          const now = Date.now();
          const sessionDuration = savedRememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 days if remember me, 24 hours otherwise

          if (authenticated && (now - timestamp) < sessionDuration) {
            setIsAuthenticated(true);
            setCheckingAuth(false);
            return;
          } else {
            // Session expired
            localStorage.removeItem('analytics_auth');
          }
        } catch (error) {
          console.error('Error parsing auth data:', error);
          localStorage.removeItem('analytics_auth');
        }
      }
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        // Store authentication in localStorage
        const authData = {
          authenticated: true,
          timestamp: Date.now(),
          rememberMe: rememberMe
        };
        localStorage.setItem('analytics_auth', JSON.stringify(authData));

        setIsAuthenticated(true);
        setPassword(''); // Clear password field
        loadAnalytics();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('analytics_auth');
    setIsAuthenticated(false);
    setAnalytics(null);
    setRealTimeStats(null);
  };

  const loadAnalytics = async () => {
    try {
      const analyticsRes = await fetch('/api/analytics?days=30');

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);

        // Calculate today's stats from analytics data instead of using separate API
        const today = new Date().toISOString().split('T')[0];
        const todayData = analyticsData.dailyData.find(day => day.date === today);

        if (todayData) {
          // Use today's data from daily summaries
          setRealTimeStats({
            today: todayData,
            cacheHitRate: todayData.totalRequests > 0 ?
              (todayData.cachedRequests / todayData.totalRequests * 100).toFixed(1) : 0
          });
        } else {
          // Calculate from recent requests if no daily summary exists
          const todayRequests = analyticsData.recentRequests.filter(req => {
            const reqDate = new Date(req.timestamp).toISOString().split('T')[0];
            return reqDate === today;
          });

          const todayStats = {
            totalRequests: todayRequests.length,
            totalTokens: todayRequests.reduce((sum, req) => sum + (req.totalTokens || 0), 0),
            totalCost: todayRequests.reduce((sum, req) => sum + (req.cost || 0), 0),
            cachedRequests: todayRequests.filter(req => req.cached).length,
            errors: todayRequests.filter(req => !req.success).length,
            avgResponseTime: todayRequests.length > 0 ?
              todayRequests.reduce((sum, req) => sum + (req.responseTime || 0), 0) / todayRequests.length : 0
          };

          setRealTimeStats({
            today: todayStats,
            cacheHitRate: todayStats.totalRequests > 0 ?
              (todayStats.cachedRequests / todayStats.totalRequests * 100).toFixed(1) : 0
          });
        }
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
      // Refresh real-time stats every 30 seconds
      const interval = setInterval(loadAnalytics, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Show loading spinner while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Enter password to access internal analytics</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me for 7 days
              </label>
            </div>
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Authenticating...' : 'Access Analytics'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!analytics || !realTimeStats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'Not provided';
    return `$${amount.toFixed(4)}`;
  };
  const formatNumber = (num) => num.toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Internal usage and cost monitoring</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Today's Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(realTimeStats.today.totalRequests)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Today's Cost</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(realTimeStats.today.totalCost)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Cache Hit Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {realTimeStats.cacheHitRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(realTimeStats.today.avgResponseTime)}ms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Requests Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Requests</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRequests" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Costs Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Costs</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="totalCost" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">30-Day Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(analytics.totals.totalRequests)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tokens</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(analytics.totals.totalTokens)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(analytics.totals.totalCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cached Requests</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(analytics.totals.cachedRequests)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Errors</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(analytics.totals.errors)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2">Time</th>
                  <th className="text-left py-2">Project</th>
                  <th className="text-left py-2">Tokens</th>
                  <th className="text-left py-2">Cost</th>
                  <th className="text-left py-2">Response Time</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentRequests.slice(0, 20).map((request, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2 text-gray-600 dark:text-gray-400">
                      {new Date(request.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2 text-gray-900 dark:text-white">
                      {request.project.length > 30 ? 
                        `${request.project.substring(0, 30)}...` : 
                        request.project
                      }
                    </td>
                    <td className="py-2 text-gray-900 dark:text-white">
                      {formatNumber(request.totalTokens)}
                    </td>
                    <td className="py-2 text-gray-900 dark:text-white">
                      <span className={request.cost === null ? 'text-gray-500 italic' : ''}>
                        {formatCurrency(request.cost)}
                      </span>
                      {request.costSource === 'ai_provided' && (
                        <span className="ml-1 text-xs text-green-600" title="Cost provided by AI">✓</span>
                      )}
                    </td>
                    <td className="py-2 text-gray-900 dark:text-white">
                      {Math.round(request.responseTime)}ms
                    </td>
                    <td className="py-2">
                      {request.cached ? (
                        <span className="text-blue-600 dark:text-blue-400">Cached</span>
                      ) : request.success ? (
                        <span className="text-green-600 dark:text-green-400">Success</span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">Error</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

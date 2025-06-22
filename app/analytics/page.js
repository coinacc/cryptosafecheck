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
      <div className="min-h-screen matrix-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-500 mx-auto glow-cyber"></div>
          <p className="mt-4 text-cyber-200">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen matrix-bg flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 glass-strong rounded-lg neon-border-cyber">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gradient-cyber">Analytics Dashboard</h2>
            <p className="mt-2 text-cyber-200">Enter password to access internal analytics</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 glass neon-border rounded-lg focus:ring-2 focus:ring-cyber-500 focus:border-transparent text-cyber-100 placeholder-cyber-300 hover:glow-cyber transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-cyber-300 hover:text-cyber-100 transition-colors duration-300"
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
              <label htmlFor="remember-me" className="ml-2 block text-sm text-cyber-200">
                Remember me for 7 days
              </label>
            </div>
            {error && (
              <div className="text-bitcoin-400 text-sm text-center glow-bitcoin">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full glass neon-border-cyber text-cyber-100 font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:glow-cyber hover-glow"
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
      <div className="min-h-screen matrix-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-500 mx-auto glow-cyber"></div>
          <p className="mt-4 text-cyber-200">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'Not provided';
    return `$${amount.toFixed(4)}`;
  };
  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen matrix-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gradient-cyber">Analytics Dashboard</h1>
            <p className="text-cyber-200">Internal usage and cost monitoring</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-cyber-300 hover:text-cyber-100 transition-all duration-300 hover:glow-cyber rounded-md glass"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-strong rounded-lg p-6 shadow-lg neon-border hover-glow">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-cyber-400 glow-cyber" />
              <div className="ml-4">
                <p className="text-sm text-cyber-300">Today's Requests</p>
                <p className="text-2xl font-bold text-gradient-cyber">
                  {formatNumber(realTimeStats?.today?.totalRequests)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-lg p-6 shadow-lg neon-border hover-glow">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-neon-400 glow-neon" />
              <div className="ml-4">
                <p className="text-sm text-cyber-300">Today's Cost</p>
                <p className="text-2xl font-bold text-gradient-neon">
                  {formatCurrency(realTimeStats?.today?.totalCost)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-lg p-6 shadow-lg neon-border hover-glow">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-bitcoin-400 glow-bitcoin" />
              <div className="ml-4">
                <p className="text-sm text-cyber-300">Cache Hit Rate</p>
                <p className="text-2xl font-bold text-gradient-bitcoin">
                  {realTimeStats?.cacheHitRate || '0'}%
                </p>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-lg p-6 shadow-lg neon-border hover-glow">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-cyber-400 glow-cyber" />
              <div className="ml-4">
                <p className="text-sm text-cyber-300">Avg Response Time</p>
                <p className="text-2xl font-bold text-gradient-cyber">
                  {Math.round(realTimeStats?.today?.avgResponseTime || 0)}ms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Requests Chart */}
          <div className="glass-strong rounded-lg p-6 shadow-lg neon-border hover-glow">
            <h3 className="text-lg font-bold text-gradient-cyber mb-4">Daily Requests</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.dailyData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRequests" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Costs Chart */}
          <div className="glass-strong rounded-lg p-6 shadow-lg neon-border hover-glow">
            <h3 className="text-lg font-bold text-gradient-neon mb-4">Daily Costs</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.dailyData || []}>
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
        <div className="glass-strong rounded-lg p-6 shadow-lg mb-8 neon-border hover-glow">
          <h3 className="text-lg font-bold text-gradient-cyber mb-4">30-Day Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div>
              <p className="text-sm text-cyber-300">Total Requests</p>
              <p className="text-xl font-bold text-gradient-cyber">
                {formatNumber(analytics?.totals?.totalRequests)}
              </p>
            </div>
            <div>
              <p className="text-sm text-cyber-300">Total Tokens</p>
              <p className="text-xl font-bold text-gradient-neon">
                {formatNumber(analytics?.totals?.totalTokens)}
              </p>
            </div>
            <div>
              <p className="text-sm text-cyber-300">Total Cost</p>
              <p className="text-xl font-bold text-gradient-bitcoin">
                {formatCurrency(analytics?.totals?.totalCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-cyber-300">Cached Requests</p>
              <p className="text-xl font-bold text-gradient-cyber">
                {formatNumber(analytics?.totals?.cachedRequests)}
              </p>
            </div>
            <div>
              <p className="text-sm text-cyber-300">Errors</p>
              <p className="text-xl font-bold text-gradient-bitcoin">
                {formatNumber(analytics?.totals?.errors)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="glass-strong rounded-lg p-6 shadow-lg neon-border-cyber hover-glow">
          <h3 className="text-lg font-bold text-gradient-cyber mb-4">Recent Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyber-700">
                  <th className="text-left py-2 text-cyber-300">Time</th>
                  <th className="text-left py-2 text-cyber-300">Project</th>
                  <th className="text-left py-2 text-cyber-300">Tokens</th>
                  <th className="text-left py-2 text-cyber-300">Cost</th>
                  <th className="text-left py-2 text-cyber-300">Response Time</th>
                  <th className="text-left py-2 text-cyber-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {(analytics?.recentRequests || []).slice(0, 20).map((request, index) => (
                  <tr key={index} className="border-b border-cyber-800 hover:bg-cyber-900/20 transition-colors">
                    <td className="py-2 text-cyber-200">
                      {new Date(request.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2 text-cyber-100">
                      {request.project.length > 30 ? 
                        `${request.project.substring(0, 30)}...` : 
                        request.project
                      }
                    </td>
                    <td className="py-2 text-cyber-100">
                      {formatNumber(request?.totalTokens)}
                    </td>
                    <td className="py-2 text-cyber-100">
                      <span className={request.cost === null ? 'text-cyber-400 italic' : ''}>
                        {formatCurrency(request?.cost)}
                      </span>
                      {request.costSource === 'ai_provided' && (
                        <span className="ml-1 text-xs text-neon-400" title="Cost provided by AI">✓</span>
                      )}
                    </td>
                    <td className="py-2 text-cyber-100">
                      {Math.round(request?.responseTime || 0)}ms
                    </td>
                    <td className="py-2">
                      {request.cached ? (
                        <span className="text-cyber-400 glow-cyber">Cached</span>
                      ) : request.success ? (
                        <span className="text-neon-400 glow-neon">Success</span>
                      ) : (
                        <span className="text-bitcoin-400 glow-bitcoin">Error</span>
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

import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:barakah_app/models/asset.dart';
import 'package:barakah_app/models/transaction.dart';

class CacheService {
  static final CacheService _instance = CacheService._internal();
  factory CacheService() => _instance;
  CacheService._internal();

  static const _assetsKey = 'cached_assets';
  static const _transactionsKey = 'cached_transactions';
  static const _savingsGoalsKey = 'cached_savings_goals';
  static const _assetTotalKey = 'cached_asset_total';
  static const _lastSyncKey = 'last_sync_time';

  // ─── Assets ──────────────────────────────────────────

  Future<void> cacheAssets(List<Asset> assets) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = assets.map((a) => jsonEncode(a.toJson()..['id'] = a.id)).toList();
    await prefs.setStringList(_assetsKey, jsonList);
    await prefs.setInt(_lastSyncKey, DateTime.now().millisecondsSinceEpoch);
  }

  Future<List<Asset>> getCachedAssets() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = prefs.getStringList(_assetsKey) ?? [];
    return jsonList.map((s) => Asset.fromJson(jsonDecode(s) as Map<String, dynamic>)).toList();
  }

  // ─── Transactions ────────────────────────────────────

  Future<void> cacheTransactions(List<Transaction> transactions) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = transactions.map((t) {
      final json = t.toJson();
      json['id'] = t.id;
      json['timestamp'] = t.timestamp;
      return jsonEncode(json);
    }).toList();
    await prefs.setStringList(_transactionsKey, jsonList);
  }

  Future<List<Transaction>> getCachedTransactions() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = prefs.getStringList(_transactionsKey) ?? [];
    return jsonList.map((s) => Transaction.fromJson(jsonDecode(s) as Map<String, dynamic>)).toList();
  }

  // ─── Asset Total / Zakat ─────────────────────────────

  Future<void> cacheAssetTotal(Map<String, dynamic> total) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_assetTotalKey, jsonEncode(total));
  }

  Future<Map<String, dynamic>?> getCachedAssetTotal() async {
    final prefs = await SharedPreferences.getInstance();
    final str = prefs.getString(_assetTotalKey);
    if (str == null) return null;
    return jsonDecode(str) as Map<String, dynamic>;
  }

  // ─── Savings Goals ───────────────────────────────────

  Future<void> cacheSavingsGoals(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_savingsGoalsKey, jsonEncode(data));
  }

  Future<Map<String, dynamic>?> getCachedSavingsGoals() async {
    final prefs = await SharedPreferences.getInstance();
    final str = prefs.getString(_savingsGoalsKey);
    if (str == null) return null;
    return jsonDecode(str) as Map<String, dynamic>;
  }

  // ─── Sync Info ───────────────────────────────────────

  Future<DateTime?> getLastSyncTime() async {
    final prefs = await SharedPreferences.getInstance();
    final ms = prefs.getInt(_lastSyncKey);
    if (ms == null) return null;
    return DateTime.fromMillisecondsSinceEpoch(ms);
  }

  Future<bool> isStale({Duration maxAge = const Duration(minutes: 30)}) async {
    final lastSync = await getLastSyncTime();
    if (lastSync == null) return true;
    return DateTime.now().difference(lastSync) > maxAge;
  }

  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_assetsKey);
    await prefs.remove(_transactionsKey);
    await prefs.remove(_savingsGoalsKey);
    await prefs.remove(_assetTotalKey);
    await prefs.remove(_lastSyncKey);
  }
}

class CryptoPrice {
  final String symbol;
  final String name;
  final double price;
  final double change24h;
  final double marketCap;

  CryptoPrice({
    required this.symbol,
    required this.name,
    required this.price,
    required this.change24h,
    required this.marketCap,
  });

  factory CryptoPrice.fromJson(Map<String, dynamic> json) {
    return CryptoPrice(
      symbol: json['symbol'] as String,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
      change24h: (json['change24h'] as num?)?.toDouble() ?? 0.0,
      marketCap: (json['marketCap'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

class StockPrice {
  final String symbol;
  final double currentPrice;
  final double highPrice;
  final double lowPrice;
  final double openPrice;
  final double previousClose;

  StockPrice({
    required this.symbol,
    required this.currentPrice,
    required this.highPrice,
    required this.lowPrice,
    required this.openPrice,
    required this.previousClose,
  });

  factory StockPrice.fromJson(Map<String, dynamic> json) {
    return StockPrice(
      symbol: json['symbol'] as String,
      currentPrice: (json['currentPrice'] as num).toDouble(),
      highPrice: (json['highPrice'] as num?)?.toDouble() ?? 0.0,
      lowPrice: (json['lowPrice'] as num?)?.toDouble() ?? 0.0,
      openPrice: (json['openPrice'] as num?)?.toDouble() ?? 0.0,
      previousClose: (json['previousClose'] as num?)?.toDouble() ?? 0.0,
    );
  }

  double get changePercent {
    if (previousClose == 0) return 0;
    return ((currentPrice - previousClose) / previousClose) * 100;
  }
}

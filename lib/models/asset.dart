class Asset {
  final int? id;
  final String name;
  final String type;
  final double value;
  final String? userId;
  final String? address;

  Asset({
    this.id,
    required this.name,
    required this.type,
    required this.value,
    this.userId,
    this.address,
  });

  factory Asset.fromJson(Map<String, dynamic> json) {
    return Asset(
      id: json['id'] as int?,
      name: json['name'] as String,
      type: json['type'] as String,
      value: (json['value'] as num).toDouble(),
      userId: json['userId'] as String?,
      address: json['address'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'name': name,
      'type': type,
      'value': value,
      if (userId != null) 'userId': userId,
      if (address != null) 'address': address,
    };
  }

  Asset copyWith({
    int? id,
    String? name,
    String? type,
    double? value,
    String? userId,
    String? address,
  }) {
    return Asset(
      id: id ?? this.id,
      name: name ?? this.name,
      type: type ?? this.type,
      value: value ?? this.value,
      userId: userId ?? this.userId,
      address: address ?? this.address,
    );
  }

  String get typeIcon {
    switch (type.toLowerCase()) {
      case 'crypto': return '₿';
      case 'stock': return '📈';
      case 'gold': return '🥇';
      case 'cash': return '💵';
      case 'real_estate':
      case 'realestate':
      case 'primary_home':
      case 'investment_property':
      case 'rental_property': return '🏠';
      case 'business': return '🏢';
      case '401k':
      case 'roth_ira':
      case 'ira':
      case 'hsa':
      case '403b':
      case 'pension': return '🏦';
      case '529': return '🎓';
      case 'silver': return '🥈';
      case 'vehicle': return '🚗';
      default: return '💰';
    }
  }
}
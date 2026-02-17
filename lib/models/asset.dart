class Asset {
  final int? id;
  final String name;
  final String type;
  final double value;
  final String? userId;

  Asset({
    this.id,
    required this.name,
    required this.type,
    required this.value,
    this.userId,
  });

  factory Asset.fromJson(Map<String, dynamic> json) {
    return Asset(
      id: json['id'] as int?,
      name: json['name'] as String,
      type: json['type'] as String,
      value: (json['value'] as num).toDouble(),
      userId: json['userId'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'name': name,
      'type': type,
      'value': value,
      if (userId != null) 'userId': userId,
    };
  }

  Asset copyWith({
    int? id,
    String? name,
    String? type,
    double? value,
    String? userId,
  }) {
    return Asset(
      id: id ?? this.id,
      name: name ?? this.name,
      type: type ?? this.type,
      value: value ?? this.value,
      userId: userId ?? this.userId,
    );
  }

  /// Returns the icon for the asset type
  String get typeIcon {
    switch (type.toLowerCase()) {
      case 'crypto':
        return '₿';
      case 'stock':
        return '📈';
      case 'gold':
        return '🥇';
      case 'cash':
        return '💵';
      case 'real_estate':
      case 'realestate':
        return '🏠';
      default:
        return '💰';
    }
  }
}

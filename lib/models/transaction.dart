class Transaction {
  final int? id;
  final String type; // 'income' or 'expense'
  final String category;
  final double amount;
  final String description;
  final String currency;
  final int? timestamp;
  final bool recurring;
  final String? frequency;
  final bool? recurringActive;
  final int? nextOccurrence;

  Transaction({
    this.id,
    required this.type,
    required this.category,
    required this.amount,
    this.description = '',
    this.currency = 'USD',
    this.timestamp,
    this.recurring = false,
    this.frequency,
    this.recurringActive,
    this.nextOccurrence,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] as int?,
      type: json['type'] as String,
      category: json['category'] as String,
      amount: (json['amount'] as num).toDouble(),
      description: json['description'] as String? ?? '',
      currency: json['currency'] as String? ?? 'USD',
      timestamp: json['timestamp'] as int?,
      recurring: json['recurring'] as bool? ?? false,
      frequency: json['frequency'] as String?,
      recurringActive: json['recurringActive'] as bool?,
      nextOccurrence: json['nextOccurrence'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{
      'type': type,
      'category': category,
      'amount': amount,
      'description': description,
      'currency': currency,
    };
    if (recurring) {
      map['recurring'] = true;
      map['frequency'] = frequency;
    }
    return map;
  }

  DateTime get dateTime =>
      DateTime.fromMillisecondsSinceEpoch(timestamp ?? DateTime.now().millisecondsSinceEpoch);

  bool get isIncome => type == 'income';
  bool get isExpense => type == 'expense';

  String get categoryIcon {
    switch (category.toLowerCase()) {
      case 'salary':
        return '💼';
      case 'business':
        return '🏢';
      case 'investment':
        return '📈';
      case 'gift':
        return '🎁';
      case 'food':
        return '🍕';
      case 'transport':
        return '🚗';
      case 'shopping':
        return '🛒';
      case 'bills':
        return '📄';
      case 'health':
        return '🏥';
      case 'education':
        return '📚';
      case 'charity':
      case 'sadaqah':
        return '🤲';
      case 'zakat':
        return '☪️';
      case 'rent':
        return '🏠';
      case 'entertainment':
        return '🎬';
      default:
        return '💰';
    }
  }
}

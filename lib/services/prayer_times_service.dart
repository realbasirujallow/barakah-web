import 'package:dio/dio.dart';

class PrayerTime {
  final String name;
  final String time;
  final bool isNext;

  PrayerTime({required this.name, required this.time, this.isNext = false});
}

class PrayerTimesService {
  final Dio _dio = Dio();

  /// Fetch prayer times from Aladhan API
  Future<List<PrayerTime>> getPrayerTimes({
    required double latitude,
    required double longitude,
    int method = 2, // ISNA
  }) async {
    try {
      final now = DateTime.now();
      final response = await _dio.get(
        'https://api.aladhan.com/v1/timings/${now.day}-${now.month}-${now.year}',
        queryParameters: {
          'latitude': latitude,
          'longitude': longitude,
          'method': method,
        },
      );

      final timings = response.data['data']['timings'] as Map<String, dynamic>;
      final prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

      final prayers = <PrayerTime>[];
      String? nextPrayer;

      // Find next prayer
      for (final name in prayerNames) {
        final timeStr = timings[name] as String;
        final parts = timeStr.split(':');
        final prayerMinutes = int.parse(parts[0]) * 60 + int.parse(parts[1]);
        final nowMinutes = now.hour * 60 + now.minute;
        if (prayerMinutes > nowMinutes && nextPrayer == null) {
          nextPrayer = name;
        }
      }
      nextPrayer ??= 'Fajr'; // After Isha, next is tomorrow's Fajr

      for (final name in prayerNames) {
        prayers.add(PrayerTime(
          name: name,
          time: _formatTime(timings[name] as String),
          isNext: name == nextPrayer,
        ));
      }

      return prayers;
    } catch (_) {
      return _getDefaultPrayerTimes();
    }
  }

  /// Get Hijri date info
  Future<Map<String, String>> getHijriDate() async {
    try {
      final now = DateTime.now();
      final response = await _dio.get(
        'https://api.aladhan.com/v1/gpiToH/${now.day}-${now.month}-${now.year}',
      );
      final hijri = response.data['data']['hijri'];
      return {
        'day': hijri['day'] as String,
        'month': hijri['month']['en'] as String,
        'year': hijri['year'] as String,
        'monthNumber': hijri['month']['number'].toString(),
      };
    } catch (_) {
      return {'day': '', 'month': '', 'year': '', 'monthNumber': ''};
    }
  }

  /// Check if currently Ramadan
  Future<bool> isRamadan() async {
    final hijri = await getHijriDate();
    return hijri['monthNumber'] == '9';
  }

  String _formatTime(String time24) {
    final parts = time24.split(':');
    int hour = int.parse(parts[0]);
    final minute = parts[1];
    final ampm = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    if (hour == 0) hour = 12;
    return '$hour:$minute $ampm';
  }

  List<PrayerTime> _getDefaultPrayerTimes() {
    return [
      PrayerTime(name: 'Fajr', time: '5:30 AM'),
      PrayerTime(name: 'Sunrise', time: '6:45 AM'),
      PrayerTime(name: 'Dhuhr', time: '12:30 PM'),
      PrayerTime(name: 'Asr', time: '3:45 PM'),
      PrayerTime(name: 'Maghrib', time: '6:15 PM'),
      PrayerTime(name: 'Isha', time: '7:45 PM', isNext: true),
    ];
  }
}

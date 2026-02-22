// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';
import 'package:barakah_app/services/auth_service.dart';
import 'package:barakah_app/main.dart';

void main() {
  testWidgets('App shows login screen when not authenticated', (WidgetTester tester) async {
    final authService = AuthService();
    await tester.pumpWidget(BarakahApp(authService: authService));
    await tester.pumpAndSettle();

    // Should show login screen
    expect(find.text('Barakah'), findsOneWidget);
    expect(find.text('Login'), findsOneWidget);
  });
}


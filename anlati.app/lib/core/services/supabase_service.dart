import 'package:supabase_flutter/supabase_flutter.dart';

/// Supabase istemcisine erişim için tek nokta.
/// main.dart'ta Supabase.initialize() çağrıldıktan sonra kullanılabilir.
class SupabaseService {
  SupabaseService._();
  static SupabaseService? _instance;
  static SupabaseService get instance => _instance ??= SupabaseService._();

  SupabaseClient get client => Supabase.instance.client;

  GoTrueClient get auth => client.auth;

  User? get currentUser => auth.currentUser;
  bool  get isAuthenticated => currentUser != null;
  String? get currentUserId => currentUser?.id;
}

/// Kısa erişim kolaylığı
SupabaseClient get supabase => SupabaseService.instance.client;

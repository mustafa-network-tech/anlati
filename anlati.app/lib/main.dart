import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Durum çubuğunu şeffaf yap
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor:           Colors.transparent,
      statusBarIconBrightness:  Brightness.light,
      statusBarBrightness:      Brightness.dark,
    ),
  );

  // Dikey yönlendirmeyi kilitle
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Ortam değişkenlerini yükle
  await dotenv.load(fileName: '.env');

  final supabaseUrl = dotenv.env['SUPABASE_URL'] ??
      dotenv.env['NEXT_PUBLIC_SUPABASE_URL'] ??
      '';
  final supabaseAnonKey = dotenv.env['SUPABASE_ANON_KEY'] ??
      dotenv.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ??
      '';

  assert(
    supabaseUrl.isNotEmpty && supabaseUrl.startsWith('https://'),
    '.env dosyasında geçerli bir SUPABASE_URL bulunamadı!',
  );
  assert(
    supabaseAnonKey.isNotEmpty,
    '.env dosyasında SUPABASE_ANON_KEY bulunamadı!',
  );

  // Supabase'i başlat
  await Supabase.initialize(
    url:     supabaseUrl,
    anonKey: supabaseAnonKey,
    debug:   false,
  );

  runApp(
    const ProviderScope(
      child: AnlatiApp(),
    ),
  );
}

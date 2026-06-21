import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/app_constants.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/auth/presentation/screens/onboarding_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/register_screen.dart';
import '../../features/auth/presentation/screens/forgot_password_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/home/presentation/widgets/main_shell.dart';
import '../../features/stories/presentation/screens/story_detail_screen.dart';
import '../../features/write/presentation/screens/write_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../features/profile/presentation/screens/edit_profile_screen.dart';
import '../../features/explore/presentation/screens/explore_screen.dart';
import '../../features/notifications/presentation/screens/notifications_screen.dart';
import '../../features/settings/presentation/screens/settings_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: AppRoutes.splash,
    redirect: (context, state) async {
      final user     = Supabase.instance.client.auth.currentUser;
      final loc      = state.matchedLocation;
      final isSplash = loc == AppRoutes.splash;
      final isAuth   = loc.startsWith('/auth');
      final isOnb    = loc == AppRoutes.onboarding;

      if (isSplash) return null; // splash kendi yönlendirmesini yapar

      // Onboarding gösterildi mi?
      final prefs   = await SharedPreferences.getInstance();
      final sawOnb  = prefs.getBool('onboarding_seen') ?? false;
      if (!sawOnb && !isOnb && !isAuth) return AppRoutes.onboarding;

      // Kimlik doğrulama gerektiren sayfalar
      if (user == null && !isAuth && !isOnb) return AppRoutes.login;
      if (user != null && isAuth) return AppRoutes.home;

      return null;
    },
    routes: [
      // ── Auth ────────────────────────────────────────────
      GoRoute(
        path: AppRoutes.splash,
        builder: (ctx, state) => const SplashScreen(),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        builder: (ctx, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/auth',
        redirect: (ctx, state) => AppRoutes.login,
        routes: [
          GoRoute(
            path: 'login',
            builder: (ctx, state) => const LoginScreen(),
          ),
          GoRoute(
            path: 'register',
            builder: (ctx, state) => const RegisterScreen(),
          ),
          GoRoute(
            path: 'forgot-password',
            builder: (ctx, state) => const ForgotPasswordScreen(),
          ),
        ],
      ),

      // ── Ana kabuk (Bottom Nav) ───────────────────────────
      ShellRoute(
        builder: (ctx, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: AppRoutes.home,
            builder: (ctx, state) => const HomeScreen(),
          ),
          GoRoute(
            path: AppRoutes.explore,
            builder: (ctx, state) => const ExploreScreen(),
          ),
          GoRoute(
            path: AppRoutes.write,
            builder: (ctx, state) => const WriteScreen(),
          ),
          GoRoute(
            path: AppRoutes.notifications,
            builder: (ctx, state) => const NotificationsScreen(),
          ),
          GoRoute(
            path: AppRoutes.profile,
            builder: (ctx, state) => const ProfileScreen(),
          ),
        ],
      ),

      // ── Detay sayfaları ──────────────────────────────────
      GoRoute(
        path: '${AppRoutes.storyDetail}/:id',
        builder: (ctx, state) => StoryDetailScreen(
          storyId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: AppRoutes.settings,
        builder: (ctx, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: AppRoutes.editProfile,
        builder: (ctx, state) => const EditProfileScreen(),
      ),
    ],
  );
});

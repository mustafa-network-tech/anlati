import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/constants/app_constants.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double>   _scaleAnim;
  late Animation<double>   _fadeAnim;
  late Animation<double>   _glowAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync:    this,
      duration: const Duration(milliseconds: 1800),
    );

    _scaleAnim = Tween<double>(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
    );
    _fadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve:  const Interval(0.0, 0.5, curve: Curves.easeIn),
      ),
    );
    _glowAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve:  const Interval(0.5, 1.0, curve: Curves.easeInOut),
      ),
    );

    _controller.forward();
    _navigate();
  }

  Future<void> _navigate() async {
    await Future.delayed(const Duration(milliseconds: 2400));
    if (!mounted) return;

    final prefs  = await SharedPreferences.getInstance();
    final sawOnb = prefs.getBool('onboarding_seen') ?? false;
    final user   = Supabase.instance.client.auth.currentUser;

    if (!mounted) return;

    if (!sawOnb) {
      context.go(AppRoutes.onboarding);
    } else if (user != null) {
      context.go(AppRoutes.home);
    } else {
      context.go(AppRoutes.login);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Arka plan gradyanı
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF0D0618), AppColors.background, Color(0xFF0D0618)],
                begin:  Alignment.topLeft,
                end:    Alignment.bottomRight,
              ),
            ),
          ),

          // Animasyonlu orb
          AnimatedBuilder(
            animation: _glowAnim,
            builder: (context, child) {
              return Center(
                child: Container(
                  width:  300,
                  height: 300,
                  decoration: BoxDecoration(
                    shape:     BoxShape.circle,
                    gradient:  RadialGradient(
                      colors: [
                        AppColors.primary.withValues(alpha: 0.15 * _glowAnim.value),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              );
            },
          ),

          // Logo ve isim
          Center(
            child: AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                return Opacity(
                  opacity: _fadeAnim.value,
                  child:   Transform.scale(
                    scale: _scaleAnim.value,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Logo mark
                        Container(
                          width:      88,
                          height:     88,
                          decoration: BoxDecoration(
                            gradient:     AppColors.primaryGradient,
                            borderRadius: BorderRadius.circular(24),
                            boxShadow: [
                              BoxShadow(
                                color:       AppColors.primary.withValues(
                                  alpha: 0.5 * _glowAnim.value,
                                ),
                                blurRadius:  40,
                                spreadRadius: 8,
                              ),
                            ],
                          ),
                          child: const Center(
                            child: Text(
                              'A',
                              style: TextStyle(
                                color:      Colors.white,
                                fontSize:   48,
                                fontWeight: FontWeight.w900,
                                letterSpacing: -2,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 24),

                        // App name
                        ShaderMask(
                          shaderCallback: (bounds) =>
                              AppColors.primaryGradient.createShader(bounds),
                          child: Text(
                            AppConstants.appName,
                            style: AppTextStyles.displayLarge.copyWith(
                              color:      Colors.white,
                              fontSize:   40,
                              letterSpacing: -2,
                            ),
                          ),
                        ),

                        const SizedBox(height: 8),

                        Opacity(
                          opacity: _glowAnim.value,
                          child:   Text(
                            AppConstants.appTagline,
                            style: AppTextStyles.bodySmall.copyWith(
                              color: AppColors.textMuted,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Alt yükleme göstergesi
          Positioned(
            bottom: 60,
            left:   0,
            right:  0,
            child:  AnimatedBuilder(
              animation: _glowAnim,
              builder: (context, child) => Opacity(
                opacity: _glowAnim.value,
                child:   const Center(
                  child: SizedBox(
                    width: 24, height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(AppColors.accent),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

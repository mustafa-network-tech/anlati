import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/gradient_button.dart';

class _OnboardPage {
  final String  emoji;
  final String  title;
  final String  subtitle;
  final List<Color> gradient;

  const _OnboardPage({
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.gradient,
  });
}

const _pages = [
  _OnboardPage(
    emoji:    '✨',
    title:    'Her Hikâyenin\nBir Sesi Vardır.',
    subtitle: 'Yaşadıklarını, hissettiklerini ve içindeki sesi burada paylaş. Kimse seni yargılamıyor.',
    gradient: [Color(0xFF0D0618), Color(0xFF1A0A2E)],
  ),
  _OnboardPage(
    emoji:    '🎭',
    title:    'Yargılanmadan\nAnlat.',
    subtitle: 'İstersen anonim, istersen gerçek isminle. Buradaki tek kural: dürüstlük.',
    gradient: [Color(0xFF0A0A18), Color(0xFF0D1A2E)],
  ),
  _OnboardPage(
    emoji:    '❤️',
    title:    'Binlerce Kişi\nSeni Dinliyor.',
    subtitle: 'Empati kuran, anlayan, hisseden bir topluluk seni bekliyor. Sen yalnız değilsin.',
    gradient: [Color(0xFF18080A), Color(0xFF2E0A10)],
  ),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _current = 0;

  Future<void> _finish() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('onboarding_seen', true);
    if (mounted) context.go(AppRoutes.login);
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
          // Sayfa içeriği
          PageView.builder(
            controller: _controller,
            onPageChanged: (i) => setState(() => _current = i),
            itemCount:  _pages.length,
            itemBuilder: (ctx, i) => _OnboardPageView(page: _pages[i]),
          ),

          // Alt bölge: dots + buton
          Positioned(
            left: 0, right: 0, bottom: 0,
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
                child: Column(
                  children: [
                    // Dots
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        _pages.length,
                        (i) => AnimatedContainer(
                          duration:   const Duration(milliseconds: 300),
                          margin:     const EdgeInsets.symmetric(horizontal: 4),
                          width:      i == _current ? 24 : 8,
                          height:     8,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(4),
                            color:        i == _current
                                ? AppColors.accent
                                : AppColors.textMuted,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Buton
                    if (_current < _pages.length - 1)
                      GradientButton(
                        label:     'Devam Et',
                        onPressed: () => _controller.nextPage(
                          duration: const Duration(milliseconds: 400),
                          curve:    Curves.easeInOut,
                        ),
                        icon: Icons.arrow_forward_rounded,
                      )
                    else
                      GradientButton(
                        label:     'Başlayalım',
                        onPressed: _finish,
                        icon:      Icons.check_rounded,
                      ),

                    const SizedBox(height: 14),

                    TextButton(
                      onPressed: _finish,
                      child: Text(
                        'Atla',
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textMuted,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _OnboardPageView extends StatelessWidget {
  final _OnboardPage page;

  const _OnboardPageView({required this.page});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: page.gradient,
          begin:  Alignment.topCenter,
          end:    Alignment.bottomCenter,
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(32, 80, 32, 180),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Emoji
              Container(
                width:      120,
                height:     120,
                decoration: BoxDecoration(
                  color:        Colors.white.withValues(alpha: 0.06),
                  shape:        BoxShape.circle,
                  border:       Border.all(
                    color: Colors.white.withValues(alpha: 0.08),
                    width: 1,
                  ),
                ),
                child: Center(
                  child: Text(page.emoji, style: const TextStyle(fontSize: 56)),
                ),
              ),

              const SizedBox(height: 48),

              // Title
              ShaderMask(
                shaderCallback: (bounds) =>
                    AppColors.primaryGradient.createShader(bounds),
                child: Text(
                  page.title,
                  style:     AppTextStyles.displayLarge.copyWith(
                    color:      Colors.white,
                    fontSize:   32,
                    height:     1.15,
                  ),
                  textAlign:  TextAlign.center,
                ),
              ),

              const SizedBox(height: 20),

              Text(
                page.subtitle,
                style:     AppTextStyles.body.copyWith(
                  color:  AppColors.textSecondary,
                  height: 1.65,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

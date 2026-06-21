import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/gradient_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey     = GlobalKey<FormState>();
  final _emailCtrl   = TextEditingController();
  final _passCtrl    = TextEditingController();
  bool  _isLoading   = false;
  bool  _obscurePw   = true;
  String? _error;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _isLoading = true; _error = null; });

    try {
      await Supabase.instance.client.auth.signInWithPassword(
        email:    _emailCtrl.text.trim(),
        password: _passCtrl.text,
      );
      if (mounted) context.go(AppRoutes.home);
    } on AuthException catch (e) {
      setState(() => _error = _translateError(e.message));
    } catch (_) {
      setState(() => _error = 'Beklenmeyen bir hata oluştu.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  static String _translateError(String msg) {
    if (msg.contains('Invalid login credentials')) return 'E-posta veya şifre hatalı.';
    if (msg.contains('Email not confirmed'))       return 'E-posta doğrulanmamış. Gelen kutunu kontrol et.';
    if (msg.contains('Too many requests'))         return 'Çok fazla deneme. Lütfen bekle.';
    return msg;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Arka plan ışık efekti
          Positioned(
            top: -100, left: -100,
            child: Container(
              width:  400,
              height: 400,
              decoration: BoxDecoration(
                shape:     BoxShape.circle,
                gradient:  RadialGradient(
                  colors: [
                    AppColors.primary.withValues(alpha: 0.08),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 60),

                    // Logo
                    Center(
                      child: Container(
                        width:      64,
                        height:     64,
                        decoration: BoxDecoration(
                          gradient:     AppColors.primaryGradient,
                          borderRadius: BorderRadius.circular(18),
                          boxShadow: [
                            BoxShadow(
                              color:       AppColors.primary.withValues(alpha: 0.35),
                              blurRadius:  24,
                              offset:      const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Text(
                            'A',
                            style: TextStyle(
                              color:      Colors.white,
                              fontSize:   34,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -1.5,
                            ),
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Başlık
                    Center(
                      child: Text(
                        'Hoş Geldin',
                        style: AppTextStyles.displayMedium,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Center(
                      child: Text(
                        'Hesabına giriş yap',
                        style: AppTextStyles.bodySecondary,
                      ),
                    ),

                    const SizedBox(height: 40),

                    // E-posta
                    Text('E-posta', style: AppTextStyles.label),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller:    _emailCtrl,
                      keyboardType:  TextInputType.emailAddress,
                      style:         AppTextStyles.body,
                      decoration:    const InputDecoration(
                        hintText:       'ornek@email.com',
                        prefixIcon:     Icon(Icons.email_outlined, color: AppColors.textMuted, size: 20),
                      ),
                      validator: (v) {
                        if (v == null || v.isEmpty) return 'E-posta zorunlu.';
                        if (!v.contains('@'))        return 'Geçerli bir e-posta gir.';
                        return null;
                      },
                    ),

                    const SizedBox(height: 18),

                    // Şifre
                    Text('Şifre', style: AppTextStyles.label),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller:  _passCtrl,
                      obscureText: _obscurePw,
                      style:       AppTextStyles.body,
                      decoration:  InputDecoration(
                        hintText:    '••••••••',
                        prefixIcon:  const Icon(Icons.lock_outline_rounded, color: AppColors.textMuted, size: 20),
                        suffixIcon:  IconButton(
                          icon:     Icon(
                            _obscurePw
                                ? Icons.visibility_off_outlined
                                : Icons.visibility_outlined,
                            color: AppColors.textMuted,
                            size:  20,
                          ),
                          onPressed: () => setState(() => _obscurePw = !_obscurePw),
                        ),
                      ),
                      validator: (v) {
                        if (v == null || v.isEmpty) return 'Şifre zorunlu.';
                        if (v.length < 6)            return 'En az 6 karakter.';
                        return null;
                      },
                    ),

                    const SizedBox(height: 10),

                    // Şifremi unuttum
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () => context.push(AppRoutes.forgotPw),
                        child: const Text('Şifremi unuttum'),
                      ),
                    ),

                    // Hata mesajı
                    if (_error != null) ...[
                      const SizedBox(height: 12),
                      Container(
                        padding:    const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color:        AppColors.danger.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(14),
                          border:       Border.all(
                            color: AppColors.danger.withValues(alpha: 0.3),
                          ),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline, color: AppColors.danger, size: 18),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                _error!,
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: AppColors.danger,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],

                    const SizedBox(height: 28),

                    GradientButton(
                      label:     'Giriş Yap',
                      onPressed: _login,
                      isLoading: _isLoading,
                    ),

                    const SizedBox(height: 20),

                    // Kayıt linki
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Hesabın yok mu? ',
                          style: AppTextStyles.bodySecondary,
                        ),
                        TextButton(
                          onPressed: () => context.go(AppRoutes.register),
                          child: const Text('Üye Ol'),
                        ),
                      ],
                    ),

                    const SizedBox(height: 40),
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

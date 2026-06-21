import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/gradient_button.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey    = GlobalKey<FormState>();
  final _nameCtrl   = TextEditingController();
  final _emailCtrl  = TextEditingController();
  final _passCtrl   = TextEditingController();
  bool  _isLoading  = false;
  bool  _obscurePw  = true;
  String? _error;
  String? _success;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _isLoading = true; _error = null; _success = null; });

    try {
      final res = await Supabase.instance.client.auth.signUp(
        email:    _emailCtrl.text.trim(),
        password: _passCtrl.text,
        data:     {'display_name': _nameCtrl.text.trim()},
      );

      if (res.user != null) {
        setState(() => _success =
            'Kayıt başarılı! E-postanı doğrulamak için gelen kutunu kontrol et.');
      }
    } on AuthException catch (e) {
      setState(() => _error = _translateError(e.message));
    } catch (_) {
      setState(() => _error = 'Beklenmeyen bir hata oluştu.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  static String _translateError(String msg) {
    if (msg.contains('User already registered')) return 'Bu e-posta zaten kullanılıyor.';
    if (msg.contains('Password should be'))      return 'Şifre en az 6 karakter olmalı.';
    return msg;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon:      const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.go(AppRoutes.login),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 12),

                Text('Üye Ol', style: AppTextStyles.displayMedium),
                const SizedBox(height: 8),
                Text(
                  'Hikâye topluluğuna katıl',
                  style: AppTextStyles.bodySecondary,
                ),

                const SizedBox(height: 36),

                // İsim
                Text('İsim', style: AppTextStyles.label),
                const SizedBox(height: 8),
                TextFormField(
                  controller:  _nameCtrl,
                  style:       AppTextStyles.body,
                  decoration:  const InputDecoration(
                    hintText:    'Adın veya takma adın',
                    prefixIcon:  Icon(Icons.person_outline_rounded,
                        color: AppColors.textMuted, size: 20),
                  ),
                  validator: (v) {
                    if (v == null || v.isEmpty) return 'İsim zorunlu.';
                    if (v.length < 2) return 'En az 2 karakter.';
                    return null;
                  },
                ),

                const SizedBox(height: 18),

                // E-posta
                Text('E-posta', style: AppTextStyles.label),
                const SizedBox(height: 8),
                TextFormField(
                  controller:   _emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                  style:        AppTextStyles.body,
                  decoration:   const InputDecoration(
                    hintText:   'ornek@email.com',
                    prefixIcon: Icon(Icons.email_outlined,
                        color: AppColors.textMuted, size: 20),
                  ),
                  validator: (v) {
                    if (v == null || v.isEmpty) return 'E-posta zorunlu.';
                    if (!v.contains('@')) return 'Geçerli e-posta gir.';
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
                    prefixIcon:  const Icon(Icons.lock_outline_rounded,
                        color: AppColors.textMuted, size: 20),
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
                    if (v.length < 6) return 'En az 6 karakter.';
                    return null;
                  },
                ),

                if (_error != null) ...[
                  const SizedBox(height: 16),
                  _MessageBox(message: _error!, isError: true),
                ],

                if (_success != null) ...[
                  const SizedBox(height: 16),
                  _MessageBox(message: _success!, isError: false),
                ],

                const SizedBox(height: 28),

                GradientButton(
                  label:     'Üye Ol',
                  onPressed: _success == null ? _register : null,
                  isLoading: _isLoading,
                ),

                if (_success != null) ...[
                  const SizedBox(height: 14),
                  GhostButtonText(
                    label: 'Giriş Yap',
                    onPressed: () => context.go(AppRoutes.login),
                  ),
                ],

                const SizedBox(height: 20),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Zaten üye misin? ', style: AppTextStyles.bodySecondary),
                    TextButton(
                      onPressed: () => context.go(AppRoutes.login),
                      child: const Text('Giriş Yap'),
                    ),
                  ],
                ),

                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _MessageBox extends StatelessWidget {
  final String message;
  final bool   isError;

  const _MessageBox({required this.message, required this.isError});

  @override
  Widget build(BuildContext context) {
    final color = isError ? AppColors.danger : AppColors.success;
    return Container(
      padding:    const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color:        color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(14),
        border:       Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Icon(
            isError ? Icons.error_outline : Icons.check_circle_outline,
            color: color,
            size:  18,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: AppTextStyles.bodySmall.copyWith(color: color),
            ),
          ),
        ],
      ),
    );
  }
}

class GhostButtonText extends StatelessWidget {
  final String   label;
  final VoidCallback? onPressed;

  const GhostButtonText({super.key, required this.label, this.onPressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 52,
      width:  double.infinity,
      child:  OutlinedButton(
        onPressed: onPressed,
        style:     OutlinedButton.styleFrom(
          side:             const BorderSide(color: AppColors.cardBorder),
          shape:            RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          foregroundColor:  AppColors.textSecondary,
        ),
        child: Text(label),
      ),
    );
  }
}

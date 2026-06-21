import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/gradient_button.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailCtrl = TextEditingController();
  bool  _isLoading = false;
  bool  _sent      = false;
  String? _error;

  Future<void> _send() async {
    final email = _emailCtrl.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      setState(() => _error = 'Geçerli bir e-posta gir.');
      return;
    }
    setState(() { _isLoading = true; _error = null; });

    try {
      await Supabase.instance.client.auth.resetPasswordForEmail(email);
      setState(() => _sent = true);
    } on AuthException catch (e) {
      setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon:      const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.pop(),
        ),
        title: const Text('Şifremi Unuttum'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: _sent ? _SuccessView(onBack: () => context.go(AppRoutes.login))
              : _FormView(
                  ctrl:      _emailCtrl,
                  isLoading: _isLoading,
                  error:     _error,
                  onSend:    _send,
                ),
        ),
      ),
    );
  }
}

class _FormView extends StatelessWidget {
  final TextEditingController ctrl;
  final bool    isLoading;
  final String? error;
  final VoidCallback onSend;

  const _FormView({
    required this.ctrl,
    required this.isLoading,
    this.error,
    required this.onSend,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 20),
        Text('Şifre Sıfırlama', style: AppTextStyles.headline),
        const SizedBox(height: 12),
        Text(
          'E-posta adresini gir, şifre sıfırlama bağlantısı gönderelim.',
          style: AppTextStyles.bodySecondary,
        ),
        const SizedBox(height: 36),
        TextFormField(
          controller:   ctrl,
          keyboardType: TextInputType.emailAddress,
          style:        AppTextStyles.body,
          decoration:   const InputDecoration(
            hintText:   'ornek@email.com',
            prefixIcon: Icon(Icons.email_outlined, color: AppColors.textMuted, size: 20),
          ),
        ),
        if (error != null) ...[
          const SizedBox(height: 12),
          Text(error!, style: AppTextStyles.bodySmall.copyWith(color: AppColors.danger)),
        ],
        const SizedBox(height: 28),
        GradientButton(
          label:     'Bağlantı Gönder',
          onPressed: onSend,
          isLoading: isLoading,
        ),
      ],
    );
  }
}

class _SuccessView extends StatelessWidget {
  final VoidCallback onBack;

  const _SuccessView({required this.onBack});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(Icons.mark_email_read_outlined,
            color: AppColors.success, size: 80),
        const SizedBox(height: 24),
        Text('E-posta Gönderildi', style: AppTextStyles.headline),
        const SizedBox(height: 12),
        Text(
          'Gelen kutunu kontrol et ve bağlantıya tıkla.',
          style:     AppTextStyles.bodySecondary,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 36),
        GradientButton(label: 'Giriş Sayfasına Dön', onPressed: onBack),
      ],
    );
  }
}

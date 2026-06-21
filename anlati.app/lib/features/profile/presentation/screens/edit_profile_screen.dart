import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/gradient_button.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _nameCtrl = TextEditingController();
  final _bioCtrl  = TextEditingController();
  bool  _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    final userId = Supabase.instance.client.auth.currentUser?.id;
    if (userId == null) return;

    final data = await Supabase.instance.client
        .from(AppConstants.tableProfiles)
        .select()
        .eq('id', userId)
        .maybeSingle();

    if (data != null && mounted) {
      _nameCtrl.text = data['display_name'] as String? ?? '';
      _bioCtrl.text  = data['bio'] as String? ?? '';
    }
  }

  Future<void> _save() async {
    final userId = Supabase.instance.client.auth.currentUser?.id;
    if (userId == null) return;

    setState(() => _isLoading = true);
    try {
      await Supabase.instance.client
          .from(AppConstants.tableProfiles)
          .update({
            'display_name': _nameCtrl.text.trim(),
            'bio':          _bioCtrl.text.trim(),
          })
          .eq('id', userId);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content:         Text('Profil güncellendi ✓'),
            backgroundColor: AppColors.card,
          ),
        );
        Navigator.of(context).pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.danger),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _bioCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        title: const Text('Profili Düzenle'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 12),
              Text('İsim', style: AppTextStyles.label),
              const SizedBox(height: 8),
              TextFormField(
                controller: _nameCtrl,
                style:      AppTextStyles.body,
                decoration: const InputDecoration(hintText: 'Görünen adın'),
              ),
              const SizedBox(height: 20),
              Text('Biyografi', style: AppTextStyles.label),
              const SizedBox(height: 8),
              TextFormField(
                controller: _bioCtrl,
                style:      AppTextStyles.body,
                maxLines:   4,
                decoration: const InputDecoration(
                  hintText:      'Kendini tanıt…',
                  alignLabelWithHint: true,
                ),
              ),
              const SizedBox(height: 32),
              GradientButton(
                label:     'Kaydet',
                onPressed: _save,
                isLoading: _isLoading,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

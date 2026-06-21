import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/constants/app_constants.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        title: const Text('Ayarlar'),
      ),
      body: ListView(
        children: [
          const _SectionHeader(title: 'Hesap'),
          _SettingsTile(
            icon:     Icons.person_outline_rounded,
            label:    'Profili Düzenle',
            onTap:    () => context.push(AppRoutes.editProfile),
          ),
          _SettingsTile(
            icon:     Icons.lock_outline_rounded,
            label:    'Şifre Değiştir',
            onTap:    () {},
          ),
          _SettingsTile(
            icon:     Icons.notifications_outlined,
            label:    'Bildirim Ayarları',
            onTap:    () {},
          ),

          const _SectionHeader(title: 'Uygulama'),
          _SettingsTile(
            icon:     Icons.dark_mode_outlined,
            label:    'Tema',
            trailing: Text('Koyu', style: AppTextStyles.bodySmall.copyWith(color: AppColors.accent)),
            onTap:    () {},
          ),
          _SettingsTile(
            icon:     Icons.language_outlined,
            label:    'Dil',
            trailing: Text('Türkçe', style: AppTextStyles.bodySmall.copyWith(color: AppColors.textMuted)),
            onTap:    () {},
          ),

          const _SectionHeader(title: 'Gizlilik & Güvenlik'),
          _SettingsTile(
            icon:     Icons.shield_outlined,
            label:    'Gizlilik Politikası',
            onTap:    () {},
          ),
          _SettingsTile(
            icon:     Icons.article_outlined,
            label:    'Kullanım Koşulları',
            onTap:    () {},
          ),
          _SettingsTile(
            icon:     Icons.delete_outline_rounded,
            label:    'Hesabı Sil',
            color:    AppColors.danger,
            onTap:    () => _showDeleteDialog(context),
          ),

          const _SectionHeader(title: 'Hakkında'),
          _SettingsTile(
            icon:     Icons.info_outline_rounded,
            label:    'Uygulama Hakkında',
            trailing: Text('v1.0.0', style: AppTextStyles.labelMuted),
            onTap:    () {},
          ),

          const SizedBox(height: 16),

          // Çıkış
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: OutlinedButton.icon(
              onPressed: () => _signOut(context),
              style:     OutlinedButton.styleFrom(
                side:            const BorderSide(color: AppColors.cardBorder),
                foregroundColor: AppColors.danger,
                minimumSize:     const Size.fromHeight(52),
                shape:           RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              icon:  const Icon(Icons.logout_rounded, size: 20),
              label: const Text('Çıkış Yap'),
            ),
          ),

          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Future<void> _signOut(BuildContext context) async {
    await Supabase.instance.client.auth.signOut();
    if (context.mounted) context.go(AppRoutes.login);
  }

  void _showDeleteDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.card,
        title:           Text('Hesabı Sil', style: AppTextStyles.title),
        content:         Text(
          'Tüm hikâyeler ve veriler silinecek. Bu işlem geri alınamaz.',
          style: AppTextStyles.bodySecondary,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child:     const Text('İptal'),
          ),
          TextButton(
            onPressed: () {},
            style:     TextButton.styleFrom(foregroundColor: AppColors.danger),
            child:     const Text('Sil'),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
      child:   Text(
        title.toUpperCase(),
        style: AppTextStyles.labelMuted.copyWith(letterSpacing: 1.2),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData    icon;
  final String      label;
  final VoidCallback onTap;
  final Widget?     trailing;
  final Color?      color;

  const _SettingsTile({
    required this.icon,
    required this.label,
    required this.onTap,
    this.trailing,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final c = color ?? AppColors.textSecondary;
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      leading:        Container(
        width:        40,
        height:       40,
        decoration:   BoxDecoration(
          color:        c.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: c, size: 20),
      ),
      title:          Text(label, style: AppTextStyles.body.copyWith(color: color ?? AppColors.text)),
      trailing:       trailing ?? const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textMuted),
      onTap:          onTap,
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/story_card_widget.dart';
import '../../../../shared/widgets/empty_state_widget.dart';
import '../../../home/domain/stories_provider.dart';
import '../../../home/data/stories_repository.dart';

final _profileProvider = FutureProvider.autoDispose<Map<String, dynamic>?>((ref) async {
  final userId = Supabase.instance.client.auth.currentUser?.id;
  if (userId == null) return null;

  final data = await Supabase.instance.client
      .from(AppConstants.tableProfiles)
      .select()
      .eq('id', userId)
      .maybeSingle();

  return data;
});

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = Supabase.instance.client.auth.currentUser;
    if (user == null) {
      return Scaffold(
        backgroundColor: AppColors.background,
        body: EmptyStateWidget(
          emoji:    '👤',
          title:    'Giriş Yapmadın',
          message:  'Profilini görmek için giriş yap.',
          actionLabel: 'Giriş Yap',
          onAction: () => context.go(AppRoutes.login),
        ),
      );
    }

    final profileAsync = ref.watch(_profileProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: profileAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.accent, strokeWidth: 2),
        ),
        error: (e, _) => EmptyStateWidget(
          emoji: '⚠️', title: 'Hata', message: e.toString(),
        ),
        data: (profile) => CustomScrollView(
          slivers: [
            // ── Cover + Avatar ────────────────────────────
            SliverAppBar(
              expandedHeight: 220,
              pinned:         true,
              backgroundColor: AppColors.background,
              actions: [
                IconButton(
                  icon:      const Icon(Icons.settings_outlined),
                  onPressed: () => context.push(AppRoutes.settings),
                ),
                const SizedBox(width: 4),
              ],
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  children: [
                    // Cover gradient
                    Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Color(0xFF1E1B4B), Color(0xFF0D0618)],
                          begin:  Alignment.topLeft,
                          end:    Alignment.bottomRight,
                        ),
                      ),
                    ),
                    // Avatar
                    Positioned(
                      bottom: 20, left: 20,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width:      80,
                            height:     80,
                            decoration: BoxDecoration(
                              gradient:     AppColors.primaryGradient,
                              shape:        BoxShape.circle,
                              border:       Border.all(color: AppColors.background, width: 3),
                              boxShadow: [
                                BoxShadow(
                                  color:       AppColors.primary.withValues(alpha: 0.3),
                                  blurRadius:  16,
                                ),
                              ],
                            ),
                            child: Center(
                              child: Text(
                                (profile?['display_name'] as String? ??
                                    user.email ?? 'U')
                                    .substring(0, 1)
                                    .toUpperCase(),
                                style: const TextStyle(
                                  color:      Colors.white,
                                  fontSize:   36,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Profil detayları ──────────────────────────
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
              sliver:  SliverList(
                delegate: SliverChildListDelegate([
                  const SizedBox(height: 16),
                  // İsim + Düzenle
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              profile?['display_name'] as String? ??
                                  user.email?.split('@').first ?? 'Kullanıcı',
                              style: AppTextStyles.headline,
                            ),
                            if (user.email != null)
                              Text(user.email!, style: AppTextStyles.bodySmall),
                          ],
                        ),
                      ),
                      OutlinedButton(
                        onPressed: () => context.push(AppRoutes.editProfile),
                        style:     OutlinedButton.styleFrom(
                          side:            const BorderSide(color: AppColors.cardBorder),
                          shape:           RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding:         const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          foregroundColor: AppColors.textSecondary,
                        ),
                        child: Text('Düzenle', style: AppTextStyles.bodySmall),
                      ),
                    ],
                  ),

                  // Bio
                  if (profile?['bio'] != null) ...[
                    const SizedBox(height: 12),
                    Text(profile!['bio'] as String, style: AppTextStyles.bodySecondary),
                  ],

                  const SizedBox(height: 24),

                  // İstatistikler
                  Row(
                    children: [
                      _StatCard(label: 'Hikâye',   value: '0'),
                      const SizedBox(width: 10),
                      _StatCard(label: 'Okunma',   value: '0'),
                      const SizedBox(width: 10),
                      _StatCard(label: 'Beğeni',   value: '0'),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Rozetler
                  Text('Rozetler', style: AppTextStyles.title),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 10, runSpacing: 10,
                    children: [
                      _BadgeChip(emoji: '🌱', label: 'Yeni Üye', locked: false),
                      _BadgeChip(emoji: '✍️', label: 'İlk Hikâye', locked: true),
                      _BadgeChip(emoji: '👁️', label: '1K Görüntülenme', locked: true),
                      _BadgeChip(emoji: '💬', label: '100 Yorum', locked: true),
                      _BadgeChip(emoji: '❤️', label: 'Topluluk Kahramanı', locked: true),
                    ],
                  ),

                  const SizedBox(height: 28),

                  Text('Hikâyelerim', style: AppTextStyles.title),
                  const SizedBox(height: 8),
                  EmptyStateWidget(
                    emoji:   '📝',
                    title:   'Henüz hikâye yok',
                    message: 'İlk hikâyeni yaz!',
                    actionLabel: 'Yaz',
                    onAction: () => context.go(AppRoutes.write),
                  ),

                  const SizedBox(height: 40),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;

  const _StatCard({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding:    const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color:        AppColors.card,
          borderRadius: BorderRadius.circular(16),
          border:       Border.all(color: AppColors.cardBorder),
        ),
        child: Column(
          children: [
            Text(value, style: AppTextStyles.headline),
            const SizedBox(height: 4),
            Text(label, style: AppTextStyles.labelMuted),
          ],
        ),
      ),
    );
  }
}

class _BadgeChip extends StatelessWidget {
  final String emoji;
  final String label;
  final bool   locked;

  const _BadgeChip({
    required this.emoji,
    required this.label,
    required this.locked,
  });

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: locked ? 0.35 : 1.0,
      child:   Container(
        padding:    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color:        AppColors.card,
          borderRadius: BorderRadius.circular(20),
          border:       Border.all(color: AppColors.cardBorder),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(locked ? '🔒' : emoji, style: const TextStyle(fontSize: 16)),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: AppTextStyles.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                if (locked)
                  Text('Kilitli', style: AppTextStyles.labelMuted),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

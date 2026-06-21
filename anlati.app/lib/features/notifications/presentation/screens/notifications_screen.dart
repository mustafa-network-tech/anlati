import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../shared/widgets/empty_state_widget.dart';

class _NotifItem {
  final String emoji;
  final String title;
  final String time;
  final bool   isRead;

  const _NotifItem({
    required this.emoji,
    required this.title,
    required this.time,
    required this.isRead,
  });
}

const _mockNotifs = [
  _NotifItem(emoji: '❤️',  title: 'Hikâyeni 12 kişi beğendi',        time: '2 dk önce',  isRead: false),
  _NotifItem(emoji: '💬',  title: 'Zeynep hikâyene yorum yaptı',      time: '15 dk önce', isRead: false),
  _NotifItem(emoji: '👥',  title: 'Meral seni takip etmeye başladı',  time: '1 saat önce',isRead: true),
  _NotifItem(emoji: '✨',  title: 'Hikâyen Editörün Seçimine girdi!', time: '3 saat önce',isRead: true),
  _NotifItem(emoji: '📖',  title: 'Hikâyen 1000 görüntülenmeye ulaştı!', time: '1 gün önce', isRead: true),
];

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        title:   const Text('Bildirimler'),
        actions: [
          TextButton(
            onPressed: () {},
            child: Text(
              'Tümünü oku',
              style: AppTextStyles.bodySmall.copyWith(color: AppColors.accent),
            ),
          ),
        ],
      ),
      body: _mockNotifs.isEmpty
          ? const EmptyStateWidget(
              emoji:   '🔔',
              title:   'Bildirim yok',
              message: 'Yeni bildirimler burada görünür.',
            )
          : ListView.separated(
              itemCount: _mockNotifs.length,
              separatorBuilder: (_, __) => const Divider(
                color:   AppColors.cardBorder,
                height:  1,
                indent:  60,
              ),
              itemBuilder: (ctx, i) {
                final notif = _mockNotifs[i];
                return ListTile(
                  tileColor:       notif.isRead
                      ? Colors.transparent
                      : AppColors.primary.withValues(alpha: 0.05),
                  leading: Container(
                    width:      44,
                    height:     44,
                    decoration: BoxDecoration(
                      color:  AppColors.card,
                      shape:  BoxShape.circle,
                      border: Border.all(color: AppColors.cardBorder),
                    ),
                    child: Center(
                      child: Text(notif.emoji, style: const TextStyle(fontSize: 22)),
                    ),
                  ),
                  title: Text(
                    notif.title,
                    style: AppTextStyles.body.copyWith(
                      fontWeight: notif.isRead ? FontWeight.w400 : FontWeight.w600,
                    ),
                  ),
                  subtitle: Text(notif.time, style: AppTextStyles.labelMuted),
                  trailing: notif.isRead
                      ? null
                      : Container(
                          width:      8,
                          height:     8,
                          decoration: const BoxDecoration(
                            color:  AppColors.accent,
                            shape:  BoxShape.circle,
                          ),
                        ),
                );
              },
            ),
    );
  }
}

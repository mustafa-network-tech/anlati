import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/constants/app_constants.dart';
import '../models/story_model.dart';
import 'category_badge.dart';

class StoryCardWidget extends StatelessWidget {
  final StoryModel story;
  final VoidCallback? onLike;
  final VoidCallback? onBookmark;

  const StoryCardWidget({
    super.key,
    required this.story,
    this.onLike,
    this.onBookmark,
  });

  // Her kategori için benzersiz gradient
  static const List<List<Color>> _gradients = [
    [Color(0xFF1E1B4B), Color(0xFF312E81)],
    [Color(0xFF1A0A0F), Color(0xFF7F1D1D)],
    [Color(0xFF052E16), Color(0xFF14532D)],
    [Color(0xFF1C1917), Color(0xFF44403C)],
    [Color(0xFF0C0A09), Color(0xFF292524)],
    [Color(0xFF1E1A2E), Color(0xFF3B0764)],
    [Color(0xFF0F172A), Color(0xFF1E3A5F)],
    [Color(0xFF1A0A2E), Color(0xFF4C1D95)],
  ];

  List<Color> get _cardGradient {
    final index = story.id.hashCode % _gradients.length;
    return _gradients[index.abs()];
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('${AppRoutes.storyDetail}/${story.id}'),
      child: Container(
        margin:     const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color:        AppColors.card,
          borderRadius: BorderRadius.circular(24),
          border:       Border.all(color: AppColors.cardBorder, width: 1),
          boxShadow: [
            BoxShadow(
              color:       Colors.black.withValues(alpha: 0.3),
              blurRadius:  20,
              offset:      const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Cover art ─────────────────────────────────────
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(23)),
              child: Container(
                height:     170,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: _cardGradient,
                    begin:  Alignment.topLeft,
                    end:    Alignment.bottomRight,
                  ),
                ),
                child: Stack(
                  children: [
                    // Decorative circles
                    Positioned(
                      top: -30, right: -30,
                      child: Container(
                        width:      140,
                        height:     140,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white.withValues(alpha: 0.04),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: -20, left: -20,
                      child: Container(
                        width:      100,
                        height:     100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white.withValues(alpha: 0.03),
                        ),
                      ),
                    ),
                    // Gradient overlay bottom
                    Positioned.fill(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.transparent,
                              AppColors.card.withValues(alpha: 0.6),
                            ],
                            begin: Alignment.topCenter,
                            end:   Alignment.bottomCenter,
                          ),
                        ),
                      ),
                    ),
                    // Category badge
                    Positioned(
                      top: 14, left: 14,
                      child: CategoryBadge(category: story.category),
                    ),
                    // Bookmark
                    Positioned(
                      top: 12, right: 12,
                      child: GestureDetector(
                        onTap:     onBookmark,
                        behavior:  HitTestBehavior.opaque,
                        child: Container(
                          width:      36,
                          height:     36,
                          decoration: BoxDecoration(
                            color:        Colors.black.withValues(alpha: 0.45),
                            shape:        BoxShape.circle,
                          ),
                          child: Icon(
                            story.isBookmarked
                                ? Icons.bookmark_rounded
                                : Icons.bookmark_border_rounded,
                            color: story.isBookmarked
                                ? AppColors.accent
                                : Colors.white70,
                            size: 18,
                          ),
                        ),
                      ),
                    ),
                    // Read time bottom right
                    Positioned(
                      bottom: 12, right: 14,
                      child: Row(
                        children: [
                          const Icon(Icons.access_time_rounded, size: 12, color: Colors.white70),
                          const SizedBox(width: 4),
                          Text(
                            '${story.readTimeMinutes} dk',
                            style: const TextStyle(
                              color:      Colors.white70,
                              fontSize:   11,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Body ──────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Author row
                  Row(
                    children: [
                      _AuthorAvatar(
                        name:   story.displayAuthor,
                        radius: 14,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          story.displayAuthor,
                          style: AppTextStyles.bodySmall.copyWith(
                            color:      AppColors.textSecondary,
                            fontWeight: FontWeight.w500,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Text(
                        _formatDate(story.createdAt),
                        style: AppTextStyles.labelMuted,
                      ),
                    ],
                  ),

                  const SizedBox(height: 10),

                  // Title
                  Text(
                    story.title,
                    style:     AppTextStyles.storyTitle,
                    maxLines:  2,
                    overflow:  TextOverflow.ellipsis,
                  ),

                  const SizedBox(height: 6),

                  // Excerpt
                  Text(
                    story.summary,
                    style:     AppTextStyles.storyExcerpt,
                    maxLines:  3,
                    overflow:  TextOverflow.ellipsis,
                  ),

                  const SizedBox(height: 14),

                  // Stats row
                  Row(
                    children: [
                      _StatChip(
                        icon:  Icons.remove_red_eye_outlined,
                        value: _formatCount(story.readCount),
                      ),
                      const SizedBox(width: 14),
                      _StatChip(
                        icon:  Icons.chat_bubble_outline_rounded,
                        value: _formatCount(story.commentCount),
                      ),
                      const Spacer(),
                      // Like button
                      GestureDetector(
                        onTap:     onLike,
                        behavior:  HitTestBehavior.opaque,
                        child: AnimatedContainer(
                          duration:   const Duration(milliseconds: 200),
                          padding:    const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                          decoration: BoxDecoration(
                            color:        story.isLiked
                                ? AppColors.danger.withValues(alpha: 0.15)
                                : AppColors.surface,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                story.isLiked
                                    ? Icons.favorite_rounded
                                    : Icons.favorite_border_rounded,
                                size:  16,
                                color: story.isLiked
                                    ? AppColors.danger
                                    : AppColors.textMuted,
                              ),
                              const SizedBox(width: 5),
                              Text(
                                _formatCount(story.likeCount),
                                style: TextStyle(
                                  color:      story.isLiked
                                      ? AppColors.danger
                                      : AppColors.textMuted,
                                  fontSize:   12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  static String _formatCount(int n) {
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000)    return '${(n / 1000).toStringAsFixed(n >= 10000 ? 0 : 1)}K';
    return n.toString();
  }

  static String _formatDate(DateTime dt) {
    final diff = DateTime.now().difference(dt);
    if (diff.inMinutes  < 60) return '${diff.inMinutes} dk önce';
    if (diff.inHours    < 24) return '${diff.inHours} sa önce';
    if (diff.inDays     < 7)  return '${diff.inDays} gün önce';
    return '${dt.day}.${dt.month}.${dt.year}';
  }
}

class _StatChip extends StatelessWidget {
  final IconData icon;
  final String   value;

  const _StatChip({required this.icon, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.textMuted),
        const SizedBox(width: 4),
        Text(value, style: AppTextStyles.labelMuted),
      ],
    );
  }
}

class _AuthorAvatar extends StatelessWidget {
  final String name;
  final double radius;

  const _AuthorAvatar({required this.name, required this.radius});

  @override
  Widget build(BuildContext context) {
    final initials = name.length >= 2
        ? name.substring(0, 2).toUpperCase()
        : name.substring(0, 1).toUpperCase();

    return CircleAvatar(
      radius:          radius,
      backgroundColor: AppColors.primary.withValues(alpha: 0.3),
      child: Text(
        initials,
        style: TextStyle(
          color:      Colors.white,
          fontSize:   radius * 0.7,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

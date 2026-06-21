import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../shared/models/story_model.dart';
import '../../../../shared/widgets/category_badge.dart';
import '../../../../shared/widgets/empty_state_widget.dart';
import '../../../home/domain/stories_provider.dart';
import '../../../home/data/stories_repository.dart';

class StoryDetailScreen extends ConsumerStatefulWidget {
  final String storyId;

  const StoryDetailScreen({super.key, required this.storyId});

  @override
  ConsumerState<StoryDetailScreen> createState() => _StoryDetailScreenState();
}

class _StoryDetailScreenState extends ConsumerState<StoryDetailScreen> {
  final _scrollController = ScrollController();
  double _readProgress = 0;
  final _commentCtrl = TextEditingController();
  final bool _isPostingComment = false;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    final max = _scrollController.position.maxScrollExtent;
    if (max <= 0) return;
    setState(() {
      _readProgress = (_scrollController.offset / max).clamp(0.0, 1.0);
    });
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    _commentCtrl.dispose();
    super.dispose();
  }

  Future<void> _toggleLike(StoryModel story) async {
    final userId = Supabase.instance.client.auth.currentUser?.id;
    if (userId == null) return;
    await StoriesRepository.instance.toggleLike(story.id, userId, story.isLiked);
    ref.invalidate(storyDetailProvider(story.id));
  }

  Future<void> _toggleBookmark(StoryModel story) async {
    final userId = Supabase.instance.client.auth.currentUser?.id;
    if (userId == null) return;
    await StoriesRepository.instance.toggleBookmark(story.id, userId, story.isBookmarked);
    ref.invalidate(storyDetailProvider(story.id));
  }

  @override
  Widget build(BuildContext context) {
    final storyAsync = ref.watch(storyDetailProvider(widget.storyId));

    return Scaffold(
      backgroundColor: AppColors.background,
      body:            storyAsync.when(
        loading: () => const _LoadingView(),
        error:   (e, _) => EmptyStateWidget(
          emoji:   '⚠️',
          title:   'Hikâye yüklenemedi',
          message: e.toString(),
        ),
        data: (story) {
          if (story == null) {
            return const EmptyStateWidget(
              emoji:   '📭',
              title:   'Hikâye bulunamadı',
              message: 'Bu hikâye kaldırılmış olabilir.',
            );
          }
          return _StoryView(
            story:            story,
            scrollController: _scrollController,
            readProgress:     _readProgress,
            commentCtrl:      _commentCtrl,
            isPosting:        _isPostingComment,
            onLike:           () => _toggleLike(story),
            onBookmark:       () => _toggleBookmark(story),
          );
        },
      ),
    );
  }
}

// ── Hikâye görünümü ────────────────────────────────────────────

class _StoryView extends StatelessWidget {
  final StoryModel       story;
  final ScrollController scrollController;
  final double           readProgress;
  final TextEditingController commentCtrl;
  final bool             isPosting;
  final VoidCallback     onLike;
  final VoidCallback     onBookmark;

  const _StoryView({
    required this.story,
    required this.scrollController,
    required this.readProgress,
    required this.commentCtrl,
    required this.isPosting,
    required this.onLike,
    required this.onBookmark,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // İçerik
        CustomScrollView(
          controller: scrollController,
          slivers: [
            // ── Cover + App Bar ───────────────────────────
            SliverAppBar(
              expandedHeight: 260,
              pinned:         true,
              backgroundColor: AppColors.background,
              leading: IconButton(
                icon:      const Icon(Icons.arrow_back_rounded),
                onPressed: () => Navigator.of(context).pop(),
              ),
              actions: [
                IconButton(
                  icon:      Icon(
                    story.isBookmarked
                        ? Icons.bookmark_rounded
                        : Icons.bookmark_border_rounded,
                    color: story.isBookmarked ? AppColors.accent : AppColors.textMuted,
                  ),
                  onPressed: onBookmark,
                ),
                const SizedBox(width: 8),
              ],
              flexibleSpace: FlexibleSpaceBar(
                background: _CoverArt(coverDesign: story.id.hashCode),
              ),
            ),

            // ── İçerik ───────────────────────────────────
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 120),
              sliver:  SliverList(
                delegate: SliverChildListDelegate([
                  const SizedBox(height: 20),

                  // Kategori
                  CategoryBadge(category: story.category),
                  const SizedBox(height: 16),

                  // Başlık
                  Text(story.title, style: AppTextStyles.displayMedium),
                  const SizedBox(height: 20),

                  // Yazar
                  _AuthorRow(story: story),
                  const SizedBox(height: 8),

                  // Okuma süresi
                  Row(
                    children: [
                      const Icon(Icons.access_time_rounded, size: 14, color: AppColors.textMuted),
                      const SizedBox(width: 5),
                      Text(
                        '${story.readTimeMinutes} dakika okuma · ${_formatCount(story.readCount)} okunma',
                        style: AppTextStyles.labelMuted,
                      ),
                    ],
                  ),

                  const SizedBox(height: 28),
                  const Divider(color: AppColors.cardBorder),
                  const SizedBox(height: 28),

                  // İçerik paragrafları
                  ...story.fullText.split('\n\n').map(
                    (para) => Padding(
                      padding: const EdgeInsets.only(bottom: 20),
                      child:   Text(para, style: AppTextStyles.readingBody),
                    ),
                  ),

                  const SizedBox(height: 32),
                  const Divider(color: AppColors.cardBorder),
                  const SizedBox(height: 24),

                  // Beğeni & Yorum sayıları
                  Row(
                    children: [
                      _StatPill(
                        icon:  Icons.favorite_rounded,
                        value: _formatCount(story.likeCount),
                        color: AppColors.danger,
                      ),
                      const SizedBox(width: 12),
                      _StatPill(
                        icon:  Icons.chat_bubble_rounded,
                        value: _formatCount(story.commentCount),
                        color: AppColors.accent,
                      ),
                    ],
                  ),

                  const SizedBox(height: 40),
                ]),
              ),
            ),
          ],
        ),

        // ── Okuma ilerleme çubuğu ─────────────────────────
        Positioned(
          top: 0, left: 0, right: 0,
          child: LinearProgressIndicator(
            value:           readProgress,
            backgroundColor: Colors.transparent,
            valueColor:      const AlwaysStoppedAnimation<Color>(AppColors.accent),
            minHeight:       3,
          ),
        ),

        // ── Alt aksiyon çubuğu ────────────────────────────
        Positioned(
          bottom: 0, left: 0, right: 0,
          child: Container(
            padding:    EdgeInsets.fromLTRB(16, 12, 16,
                MediaQuery.of(context).padding.bottom + 12),
            decoration: const BoxDecoration(
              color:  AppColors.card,
              border: Border(
                top: BorderSide(color: AppColors.cardBorder, width: 1),
              ),
            ),
            child: Row(
              children: [
                // Beğeni butonu
                _ActionBtn(
                  icon:    story.isLiked
                      ? Icons.favorite_rounded
                      : Icons.favorite_border_rounded,
                  label:   _formatCount(story.likeCount),
                  color:   story.isLiked ? AppColors.danger : AppColors.textMuted,
                  onTap:   onLike,
                ),
                const SizedBox(width: 16),
                // Yorum alanı
                Expanded(
                  child: TextField(
                    controller:  commentCtrl,
                    style:       AppTextStyles.bodySmall,
                    maxLines:    1,
                    decoration:  InputDecoration(
                      hintText:        'Bir şeyler yaz…',
                      hintStyle:       AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textMuted,
                      ),
                      filled:          true,
                      fillColor:       AppColors.background,
                      contentPadding:  const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 10,
                      ),
                      border:          OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide:   BorderSide.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  width:      40,
                  height:     40,
                  decoration: BoxDecoration(
                    gradient:     AppColors.primaryGradient,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  static String _formatCount(int n) {
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}K';
    return n.toString();
  }
}

class _AuthorRow extends StatelessWidget {
  final StoryModel story;
  const _AuthorRow({required this.story});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        CircleAvatar(
          radius:          20,
          backgroundColor: AppColors.primary.withValues(alpha: 0.3),
          child:           Text(
            story.displayAuthor.substring(0, 1).toUpperCase(),
            style: const TextStyle(
              color:      Colors.white,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(story.displayAuthor, style: AppTextStyles.titleMedium),
            Text(
              _formatDate(story.createdAt),
              style: AppTextStyles.labelMuted,
            ),
          ],
        ),
      ],
    );
  }

  static String _formatDate(DateTime dt) {
    return '${dt.day}.${dt.month}.${dt.year}';
  }
}

class _CoverArt extends StatelessWidget {
  final int coverDesign;
  const _CoverArt({required this.coverDesign});

  static const List<List<Color>> _gradients = [
    [Color(0xFF1E1B4B), Color(0xFF312E81)],
    [Color(0xFF1A0A0F), Color(0xFF7F1D1D)],
    [Color(0xFF052E16), Color(0xFF14532D)],
    [Color(0xFF1C1917), Color(0xFF44403C)],
    [Color(0xFF0F172A), Color(0xFF1E3A5F)],
    [Color(0xFF1E1A2E), Color(0xFF3B0764)],
  ];

  @override
  Widget build(BuildContext context) {
    final colors = _gradients[coverDesign.abs() % _gradients.length];
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: colors,
          begin:  Alignment.topLeft,
          end:    Alignment.bottomRight,
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            top: -60, right: -60,
            child: Container(
              width:      220,
              height:     220,
              decoration: BoxDecoration(
                shape:  BoxShape.circle,
                color:  Colors.white.withValues(alpha: 0.04),
              ),
            ),
          ),
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors:  [Colors.transparent, AppColors.background.withValues(alpha: 0.8)],
                  begin:   Alignment.topCenter,
                  end:     Alignment.bottomCenter,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatPill extends StatelessWidget {
  final IconData icon;
  final String   value;
  final Color    color;

  const _StatPill({required this.icon, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding:    const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color:        color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
        border:       Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 16),
          const SizedBox(width: 6),
          Text(value, style: TextStyle(color: color, fontWeight: FontWeight.w600, fontSize: 13)),
        ],
      ),
    );
  }
}

class _ActionBtn extends StatelessWidget {
  final IconData     icon;
  final String       label;
  final Color        color;
  final VoidCallback onTap;

  const _ActionBtn({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 2),
          Text(label, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}

class _LoadingView extends StatelessWidget {
  const _LoadingView();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: CircularProgressIndicator(
          color:       AppColors.accent,
          strokeWidth: 2,
        ),
      ),
    );
  }
}

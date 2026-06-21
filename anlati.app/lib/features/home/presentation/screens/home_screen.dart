import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/story_card_widget.dart';
import '../../../../shared/widgets/skeleton_loader.dart';
import '../../../../shared/widgets/empty_state_widget.dart';
import '../../domain/stories_provider.dart';
import '../../data/stories_repository.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  String? _selectedCategory;

  static const _categories = [
    null,
    'yalnizlik',
    'aile',
    'is_hayati',
    'iliskiler',
    'yeniden_baslamak',
    'annelik',
    'cesaret',
    'ozgurluk',
  ];

  Future<void> _toggleLike(String storyId, bool currentlyLiked) async {
    final userId = Supabase.instance.client.auth.currentUser?.id;
    if (userId == null) { _showAuthSnack(); return; }
    await StoriesRepository.instance.toggleLike(storyId, userId, currentlyLiked);
    ref.invalidate(storiesProvider(_selectedCategory));
  }

  Future<void> _toggleBookmark(String storyId, bool currentlyBookmarked) async {
    final userId = Supabase.instance.client.auth.currentUser?.id;
    if (userId == null) { _showAuthSnack(); return; }
    await StoriesRepository.instance.toggleBookmark(storyId, userId, currentlyBookmarked);
    ref.invalidate(storiesProvider(_selectedCategory));
  }

  void _showAuthSnack() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content:  const Text('Bu işlem için giriş yap'),
        action:   SnackBarAction(
          label:    'Giriş Yap',
          onPressed: () => context.go(AppRoutes.login),
        ),
        backgroundColor: AppColors.card,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final storiesAsync = ref.watch(storiesProvider(_selectedCategory));

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // ── App Bar ───────────────────────────────────────
          SliverAppBar(
            floating:          true,
            backgroundColor:   AppColors.background,
            expandedHeight:    110,
            flexibleSpace:     FlexibleSpaceBar(
              titlePadding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
              title: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  ShaderMask(
                    shaderCallback: (bounds) =>
                        AppColors.primaryGradient.createShader(bounds),
                    child: Text(
                      AppConstants.appName,
                      style: AppTextStyles.displayMedium.copyWith(
                        color:       Colors.white,
                        fontSize:    28,
                        letterSpacing: -1.5,
                      ),
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon:      const Icon(Icons.search_rounded, size: 24),
                    color:     AppColors.textSecondary,
                    onPressed: () => context.go(AppRoutes.explore),
                  ),
                ],
              ),
            ),
          ),

          // ── Kategori filtresi ─────────────────────────────
          SliverPersistentHeader(
            pinned: true,
            delegate: _CategoryFilterDelegate(
              selectedCategory: _selectedCategory,
              categories:       _categories,
              onSelected: (cat) {
                setState(() => _selectedCategory = cat);
                ref.invalidate(storiesProvider(cat));
              },
            ),
          ),

          // ── Hikâyeler ─────────────────────────────────────
          storiesAsync.when(
            loading: () => SliverList(
              delegate: SliverChildBuilderDelegate(
                (ctx, i) => const StoryCardSkeleton(),
                childCount: 5,
              ),
            ),
            error: (err, _) => SliverFillRemaining(
              child: EmptyStateWidget(
                emoji:    '⚠️',
                title:    'Hikâyeler yüklenemedi',
                message:  err.toString(),
                actionLabel: 'Tekrar Dene',
                onAction:    () => ref.invalidate(storiesProvider(_selectedCategory)),
              ),
            ),
            data: (stories) {
              if (stories.isEmpty) {
                return SliverFillRemaining(
                  child: EmptyStateWidget(
                    emoji:    '📭',
                    title:    'Henüz hikâye yok',
                    message:  'İlk hikâyeyi sen yaz!',
                    actionLabel: 'Hikâye Yaz',
                    onAction: () => context.go(AppRoutes.write),
                  ),
                );
              }
              return SliverList(
                delegate: SliverChildBuilderDelegate(
                  (ctx, i) {
                    final story = stories[i];
                    return StoryCardWidget(
                      story:      story,
                      onLike:     () => _toggleLike(story.id, story.isLiked),
                      onBookmark: () => _toggleBookmark(story.id, story.isBookmarked),
                    );
                  },
                  childCount: stories.length,
                ),
              );
            },
          ),

          const SliverPadding(padding: EdgeInsets.only(bottom: 24)),
        ],
      ),
    );
  }
}

class _CategoryFilterDelegate extends SliverPersistentHeaderDelegate {
  final String?       selectedCategory;
  final List<String?> categories;
  final void Function(String?) onSelected;

  _CategoryFilterDelegate({
    required this.selectedCategory,
    required this.categories,
    required this.onSelected,
  });

  @override
  double get minExtent => 56;
  @override
  double get maxExtent => 56;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return Container(
      color: AppColors.background,
      height: 56,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding:         const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        itemCount:       categories.length,
        itemBuilder: (ctx, i) {
          final cat   = categories[i];
          final label = cat == null
              ? 'Tümü'
              : AppColors.categoryLabel(cat);
          final color = cat == null
              ? AppColors.accent
              : AppColors.categoryColor(cat);
          final isSelected = selectedCategory == cat;

          return GestureDetector(
            onTap: () => onSelected(cat),
            child: AnimatedContainer(
              duration:   const Duration(milliseconds: 200),
              margin:     const EdgeInsets.only(right: 8),
              padding:    const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color:        isSelected
                    ? color.withValues(alpha: 0.2)
                    : AppColors.card,
                borderRadius: BorderRadius.circular(20),
                border:       Border.all(
                  color: isSelected
                      ? color.withValues(alpha: 0.5)
                      : AppColors.cardBorder,
                  width: 1,
                ),
              ),
              child: Text(
                label,
                style: TextStyle(
                  color:      isSelected ? color : AppColors.textMuted,
                  fontSize:   13,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  @override
  bool shouldRebuild(_CategoryFilterDelegate old) =>
      old.selectedCategory != selectedCategory;
}

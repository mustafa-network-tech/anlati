import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../shared/widgets/story_card_widget.dart';
import '../../../../shared/widgets/skeleton_loader.dart';
import '../../../../shared/widgets/empty_state_widget.dart';
import '../../../home/domain/stories_provider.dart';
import '../../../home/data/stories_repository.dart';

final _searchQueryProvider   = StateProvider.autoDispose<String>((ref) => '');
final _exploreCategoryProvider = StateProvider.autoDispose<String?>((ref) => null);
final _sortProvider          = StateProvider.autoDispose<String>((ref) => 'created_at');

class ExploreScreen extends ConsumerStatefulWidget {
  const ExploreScreen({super.key});

  @override
  ConsumerState<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends ConsumerState<ExploreScreen> {
  final _searchCtrl = TextEditingController();

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  String? _getCurrentUserId() {
    try {
      return Supabase.instance.client.auth.currentUser?.id;
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final query        = ref.watch(_searchQueryProvider);
    final category     = ref.watch(_exploreCategoryProvider);
    final currentSort  = ref.watch(_sortProvider);
    final storiesAsync = ref.watch(storiesProvider(category));

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // ── Arama çubuğu ──────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: TextField(
                controller:  _searchCtrl,
                style:       AppTextStyles.body,
                onChanged:   (v) =>
                    ref.read(_searchQueryProvider.notifier).state = v,
                decoration:  InputDecoration(
                  hintText:   'Hikâye, yazar, etiket ara…',
                  prefixIcon: const Icon(
                    Icons.search_rounded,
                    color: AppColors.textMuted,
                    size:  20,
                  ),
                  suffixIcon: query.isNotEmpty
                      ? IconButton(
                          icon:      const Icon(
                            Icons.clear_rounded,
                            color: AppColors.textMuted,
                            size:  18,
                          ),
                          onPressed: () {
                            _searchCtrl.clear();
                            ref.read(_searchQueryProvider.notifier).state = '';
                          },
                        )
                      : null,
                ),
              ),
            ),

            // ── Sıralama ──────────────────────────────────
            SizedBox(
              height: 44,
              child:  ListView(
                scrollDirection: Axis.horizontal,
                padding:         const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  _SortChip(
                    label:        'En Yeni',
                    value:        'created_at',
                    currentValue: currentSort,
                    onSelected:   (v) =>
                        ref.read(_sortProvider.notifier).state = v,
                  ),
                  _SortChip(
                    label:        'En Çok Okunan',
                    value:        'read_count',
                    currentValue: currentSort,
                    onSelected:   (v) =>
                        ref.read(_sortProvider.notifier).state = v,
                  ),
                  _SortChip(
                    label:        'En Çok Yorum',
                    value:        'comment_count',
                    currentValue: currentSort,
                    onSelected:   (v) =>
                        ref.read(_sortProvider.notifier).state = v,
                  ),
                  _SortChip(
                    label:        'En Çok Beğeni',
                    value:        'like_count',
                    currentValue: currentSort,
                    onSelected:   (v) =>
                        ref.read(_sortProvider.notifier).state = v,
                  ),
                ],
              ),
            ),

            // ── Hikâyeler ─────────────────────────────────
            Expanded(
              child: storiesAsync.when(
                loading: () => ListView.builder(
                  itemCount:   5,
                  itemBuilder: (_, __) => const StoryCardSkeleton(),
                ),
                error: (e, _) => EmptyStateWidget(
                  emoji:       '⚠️',
                  title:       'Yüklenemedi',
                  message:     e.toString(),
                  actionLabel: 'Tekrar Dene',
                  onAction:    () =>
                      ref.invalidate(storiesProvider(category)),
                ),
                data: (stories) {
                  final filtered = query.isEmpty
                      ? stories
                      : stories
                          .where(
                            (s) =>
                                s.title
                                    .toLowerCase()
                                    .contains(query.toLowerCase()) ||
                                s.summary
                                    .toLowerCase()
                                    .contains(query.toLowerCase()) ||
                                s.category
                                    .contains(query.toLowerCase()),
                          )
                          .toList();

                  if (filtered.isEmpty) {
                    return EmptyStateWidget(
                      emoji:   '🔍',
                      title:   'Sonuç bulunamadı',
                      message: '"$query" için hikâye yok',
                    );
                  }

                  return ListView.builder(
                    itemCount:   filtered.length,
                    itemBuilder: (ctx, i) => StoryCardWidget(
                      story: filtered[i],
                      onLike: () async {
                        final uid = _getCurrentUserId();
                        if (uid == null) return;
                        await StoriesRepository.instance.toggleLike(
                          filtered[i].id,
                          uid,
                          filtered[i].isLiked,
                        );
                        ref.invalidate(storiesProvider(category));
                      },
                      onBookmark: () async {
                        final uid = _getCurrentUserId();
                        if (uid == null) return;
                        await StoriesRepository.instance.toggleBookmark(
                          filtered[i].id,
                          uid,
                          filtered[i].isBookmarked,
                        );
                        ref.invalidate(storiesProvider(category));
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── _SortChip ─────────────────────────────────────────────────
// Provider nesnesi almaz; plain değer + callback alır.

class _SortChip extends StatelessWidget {
  final String              label;
  final String              value;
  final String              currentValue;
  final ValueChanged<String> onSelected;

  const _SortChip({
    required this.label,
    required this.value,
    required this.currentValue,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    final isSelected = currentValue == value;

    return GestureDetector(
      onTap:    () => onSelected(value),
      child: AnimatedContainer(
        duration:   const Duration(milliseconds: 180),
        margin:     const EdgeInsets.only(right: 8),
        padding:    const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color:        isSelected
              ? AppColors.primary.withValues(alpha: 0.2)
              : AppColors.card,
          borderRadius: BorderRadius.circular(20),
          border:       Border.all(
            color: isSelected ? AppColors.primary : AppColors.cardBorder,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color:      isSelected ? AppColors.accent : AppColors.textMuted,
            fontSize:   13,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
          ),
        ),
      ),
    );
  }
}

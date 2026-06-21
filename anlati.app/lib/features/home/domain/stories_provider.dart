import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/models/story_model.dart';
import '../data/stories_repository.dart';
import '../../../core/services/supabase_service.dart';

// ── Hikâye listesi ─────────────────────────────────────────────
final storiesProvider = FutureProvider.autoDispose
    .family<List<StoryModel>, String?>((ref, category) async {
  return StoriesRepository.instance.fetchStories(category: category);
});

// ── Tek hikâye ─────────────────────────────────────────────────
final storyDetailProvider = FutureProvider.autoDispose
    .family<StoryModel?, String>((ref, id) async {
  final story = await StoriesRepository.instance.fetchStoryById(id);
  if (story == null) return null;

  final userId = SupabaseService.instance.currentUserId;
  if (userId != null) {
    story.isLiked     = await StoriesRepository.instance.isLiked(id, userId);
    story.isBookmarked = await StoriesRepository.instance.isBookmarked(id, userId);
  }
  return story;
});

// ── Kayıt edilenler ────────────────────────────────────────────
final bookmarkedStoriesProvider = FutureProvider.autoDispose<List<StoryModel>>((ref) async {
  final userId = SupabaseService.instance.currentUserId;
  if (userId == null) return [];

  final data = await SupabaseService.instance.client
      .from('bookmarks')
      .select('story_id, stories(*, profiles(display_name, avatar_url))')
      .eq('user_id', userId)
      .order('created_at', ascending: false);

  return (data as List<dynamic>)
      .map((e) => StoryModel.fromMap(e['stories'] as Map<String, dynamic>))
      .toList();
});

// ── Kullanıcının hikâyeleri ────────────────────────────────────
final myStoriesProvider = FutureProvider.autoDispose<List<StoryModel>>((ref) async {
  final userId = SupabaseService.instance.currentUserId;
  if (userId == null) return [];

  return StoriesRepository.instance.fetchStories(); // Filtreleme profil sayfasında
});

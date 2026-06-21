import '../../../shared/models/story_model.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/services/supabase_service.dart';

class StoriesRepository {
  StoriesRepository._();
  static final instance = StoriesRepository._();

  Future<List<StoryModel>> fetchStories({
    int limit  = AppConstants.pageSize,
    int offset = 0,
    String? category,
    String  orderBy = 'created_at',
    bool    ascending = false,
  }) async {
    var query = supabase
        .from(AppConstants.tableStories)
        .select('*, profiles(display_name, avatar_url)')
        .eq('is_published', true)
        .order(orderBy, ascending: ascending)
        .range(offset, offset + limit - 1);

    if (category != null) {
      query = supabase
          .from(AppConstants.tableStories)
          .select('*, profiles(display_name, avatar_url)')
          .eq('is_published', true)
          .eq('category', category)
          .order(orderBy, ascending: ascending)
          .range(offset, offset + limit - 1);
    }

    final data = await query as List<dynamic>;
    return data.map((e) => StoryModel.fromMap(e as Map<String, dynamic>)).toList();
  }

  Future<StoryModel?> fetchStoryById(String id) async {
    final data = await supabase
        .from(AppConstants.tableStories)
        .select('*, profiles(display_name, avatar_url)')
        .eq('id', id)
        .eq('is_published', true)
        .maybeSingle();

    if (data == null) return null;
    return StoryModel.fromMap(data);
  }

  Future<bool> isLiked(String storyId, String userId) async {
    final res = await supabase
        .from(AppConstants.tableLikes)
        .select('id')
        .eq('story_id', storyId)
        .eq('user_id', userId)
        .maybeSingle();
    return res != null;
  }

  Future<bool> isBookmarked(String storyId, String userId) async {
    final res = await supabase
        .from(AppConstants.tableBookmarks)
        .select('id')
        .eq('story_id', storyId)
        .eq('user_id', userId)
        .maybeSingle();
    return res != null;
  }

  Future<void> toggleLike(String storyId, String userId, bool currentlyLiked) async {
    if (currentlyLiked) {
      await supabase
          .from(AppConstants.tableLikes)
          .delete()
          .eq('story_id', storyId)
          .eq('user_id', userId);
    } else {
      await supabase
          .from(AppConstants.tableLikes)
          .insert({'story_id': storyId, 'user_id': userId});
    }
  }

  Future<void> toggleBookmark(String storyId, String userId, bool currentlyBookmarked) async {
    if (currentlyBookmarked) {
      await supabase
          .from(AppConstants.tableBookmarks)
          .delete()
          .eq('story_id', storyId)
          .eq('user_id', userId);
    } else {
      await supabase
          .from(AppConstants.tableBookmarks)
          .insert({'story_id': storyId, 'user_id': userId});
    }
  }

  Future<StoryModel> createStory({
    required String authorId,
    required String title,
    required String summary,
    required String fullText,
    required String category,
    required bool   isAnonymous,
    required bool   isPublished,
  }) async {
    final data = await supabase
        .from(AppConstants.tableStories)
        .insert({
          'author_id':    authorId,
          'title':        title,
          'summary':      summary,
          'full_text':    fullText,
          'category':     category,
          'is_anonymous': isAnonymous,
          'is_published': isPublished,
        })
        .select('*, profiles(display_name, avatar_url)')
        .single();

    return StoryModel.fromMap(data);
  }
}

import '../../core/constants/app_constants.dart';
import '../../core/theme/app_colors.dart';

class StoryModel {
  final String  id;
  final String  authorId;
  final String  title;
  final String  summary;
  final String  fullText;
  final String  category;
  final bool    isAnonymous;
  final bool    isPublished;
  final int     likeCount;
  final int     commentCount;
  final int     readCount;
  final int     shareCount;
  final DateTime createdAt;
  final DateTime updatedAt;

  // Join edilmiş veriler (profile)
  final String? authorName;
  final String? authorAvatar;

  // Oturum kullanıcısına özel durum
  bool isLiked;
  bool isBookmarked;

  StoryModel({
    required this.id,
    required this.authorId,
    required this.title,
    required this.summary,
    required this.fullText,
    required this.category,
    required this.isAnonymous,
    required this.isPublished,
    required this.likeCount,
    required this.commentCount,
    required this.readCount,
    required this.shareCount,
    required this.createdAt,
    required this.updatedAt,
    this.authorName,
    this.authorAvatar,
    this.isLiked      = false,
    this.isBookmarked = false,
  });

  factory StoryModel.fromMap(Map<String, dynamic> map) {
    final profile = map['profiles'] as Map<String, dynamic>?;
    return StoryModel(
      id:           map['id'] as String,
      authorId:     map['author_id'] as String,
      title:        map['title'] as String,
      summary:      map['summary'] as String,
      fullText:     map['full_text'] as String,
      category:     map['category'] as String,
      isAnonymous:  map['is_anonymous'] as bool? ?? false,
      isPublished:  map['is_published'] as bool? ?? true,
      likeCount:    map['like_count'] as int? ?? 0,
      commentCount: map['comment_count'] as int? ?? 0,
      readCount:    map['read_count'] as int? ?? 0,
      shareCount:   map['share_count'] as int? ?? 0,
      createdAt:    DateTime.parse(map['created_at'] as String),
      updatedAt:    DateTime.parse(map['updated_at'] as String),
      authorName:   profile?['display_name'] as String?,
      authorAvatar: profile?['avatar_url'] as String?,
    );
  }

  Map<String, dynamic> toInsertMap() => {
    'author_id':    authorId,
    'title':        title,
    'summary':      summary,
    'full_text':    fullText,
    'category':     category,
    'is_anonymous': isAnonymous,
    'is_published': isPublished,
  };

  int get readTimeMinutes {
    final words = fullText.split(RegExp(r'\s+')).length;
    return (words / AppConstants.wordsPerMinute).ceil().clamp(1, 99);
  }

  String get displayAuthor =>
      isAnonymous ? 'Anonim' : (authorName ?? 'Bilinmeyen');

  String get categoryLabel =>
      AppColors.categoryLabel(category);

  StoryModel copyWith({
    bool? isLiked,
    bool? isBookmarked,
    int?  likeCount,
    int?  commentCount,
  }) {
    return StoryModel(
      id:           id,
      authorId:     authorId,
      title:        title,
      summary:      summary,
      fullText:     fullText,
      category:     category,
      isAnonymous:  isAnonymous,
      isPublished:  isPublished,
      likeCount:    likeCount    ?? this.likeCount,
      commentCount: commentCount ?? this.commentCount,
      readCount:    readCount,
      shareCount:   shareCount,
      createdAt:    createdAt,
      updatedAt:    updatedAt,
      authorName:   authorName,
      authorAvatar: authorAvatar,
      isLiked:      isLiked      ?? this.isLiked,
      isBookmarked: isBookmarked ?? this.isBookmarked,
    );
  }
}


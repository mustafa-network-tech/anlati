class CommentModel {
  final String   id;
  final String   storyId;
  final String   authorId;
  final String   content;
  final bool     isAnonymous;
  final DateTime createdAt;

  // Join
  final String? authorName;
  final String? authorAvatar;

  const CommentModel({
    required this.id,
    required this.storyId,
    required this.authorId,
    required this.content,
    required this.isAnonymous,
    required this.createdAt,
    this.authorName,
    this.authorAvatar,
  });

  factory CommentModel.fromMap(Map<String, dynamic> map) {
    final profile = map['profiles'] as Map<String, dynamic>?;
    return CommentModel(
      id:           map['id'] as String,
      storyId:      map['story_id'] as String,
      authorId:     map['author_id'] as String,
      content:      map['content'] as String,
      isAnonymous:  map['is_anonymous'] as bool? ?? false,
      createdAt:    DateTime.parse(map['created_at'] as String),
      authorName:   profile?['display_name'] as String?,
      authorAvatar: profile?['avatar_url'] as String?,
    );
  }

  String get displayAuthor =>
      isAnonymous ? 'Anonim' : (authorName ?? 'Bilinmeyen');
}

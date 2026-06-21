class ProfileModel {
  final String  id;
  final String? username;
  final String? displayName;
  final String? avatarUrl;
  final String? bio;
  final bool    isAnonymousDefault;
  final DateTime createdAt;

  const ProfileModel({
    required this.id,
    this.username,
    this.displayName,
    this.avatarUrl,
    this.bio,
    required this.isAnonymousDefault,
    required this.createdAt,
  });

  factory ProfileModel.fromMap(Map<String, dynamic> map) {
    return ProfileModel(
      id:                  map['id'] as String,
      username:            map['username'] as String?,
      displayName:         map['display_name'] as String?,
      avatarUrl:           map['avatar_url'] as String?,
      bio:                 map['bio'] as String?,
      isAnonymousDefault:  map['is_anonymous_default'] as bool? ?? false,
      createdAt:           DateTime.parse(map['created_at'] as String),
    );
  }

  Map<String, dynamic> toUpdateMap() => {
    if (username    != null) 'username':     username,
    if (displayName != null) 'display_name': displayName,
    if (avatarUrl   != null) 'avatar_url':   avatarUrl,
    if (bio         != null) 'bio':          bio,
    'is_anonymous_default': isAnonymousDefault,
  };

  String get initials {
    final name = displayName ?? username ?? 'A';
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
    }
    return name.substring(0, name.length.clamp(0, 2)).toUpperCase();
  }

  String get nameOrAnon => displayName ?? username ?? 'Anonim';

  ProfileModel copyWith({
    String? username,
    String? displayName,
    String? avatarUrl,
    String? bio,
    bool?   isAnonymousDefault,
  }) {
    return ProfileModel(
      id:                  id,
      username:            username            ?? this.username,
      displayName:         displayName         ?? this.displayName,
      avatarUrl:           avatarUrl           ?? this.avatarUrl,
      bio:                 bio                 ?? this.bio,
      isAnonymousDefault:  isAnonymousDefault  ?? this.isAnonymousDefault,
      createdAt:           createdAt,
    );
  }
}

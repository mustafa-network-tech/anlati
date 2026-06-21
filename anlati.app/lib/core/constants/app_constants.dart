abstract final class AppConstants {
  static const String appName        = 'ANLATI';
  static const String appTagline     = 'Her Hikâyenin Bir Sesi Vardır.';
  static const String appPackage     = 'com.mkdigitalsystems.anlati';

  // Supabase table names — web projesiyle aynı
  static const String tableProfiles   = 'profiles';
  static const String tableStories    = 'stories';
  static const String tableComments   = 'comments';
  static const String tableLikes      = 'likes';
  static const String tableBookmarks  = 'bookmarks';

  // Storage buckets
  static const String bucketAvatars   = 'avatars';
  static const String bucketCovers    = 'story-covers';

  // Pagination
  static const int pageSize = 20;

  // Reading speed (words per minute)
  static const int wordsPerMinute = 200;
}

abstract final class AppRoutes {
  static const String splash        = '/splash';
  static const String onboarding    = '/onboarding';
  static const String login         = '/auth/login';
  static const String register      = '/auth/register';
  static const String forgotPw      = '/auth/forgot-password';
  static const String home          = '/home';
  static const String explore       = '/explore';
  static const String write         = '/write';
  static const String notifications = '/notifications';
  static const String profile       = '/profile';
  static const String storyDetail   = '/stories';
  static const String settings      = '/settings';
  static const String editProfile   = '/profile/edit';
}

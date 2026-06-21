import 'package:flutter/material.dart';

abstract final class AppColors {
  // ── Ana renkler ────────────────────────────────────────────
  static const Color background    = Color(0xFF09090B);
  static const Color card          = Color(0xFF111827);
  static const Color primary       = Color(0xFF7C3AED);
  static const Color accent        = Color(0xFFA855F7);
  static const Color success       = Color(0xFF22C55E);
  static const Color danger        = Color(0xFFEF4444);
  static const Color text          = Color(0xFFFAFAFA);
  static const Color textSecondary = Color(0xFFA1A1AA);
  static const Color textMuted     = Color(0xFF52525B);
  static const Color cardBorder    = Color(0xFF1F2937);
  static const Color surface       = Color(0xFF18181B);
  static const Color surfaceHigh   = Color(0xFF27272A);

  // ── Gradyanlar ─────────────────────────────────────────────
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, accent],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroGradient = LinearGradient(
    colors: [Color(0xFF0D0618), Color(0xFF09090B), Color(0xFF0D0618)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient cardGradient = LinearGradient(
    colors: [Color(0xFF111827), Color(0xFF0F172A)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ── Kategori renkleri ──────────────────────────────────────
  static const Map<String, Color> categoryColors = {
    'yalnizlik':        Color(0xFF60A5FA),
    'aile':             Color(0xFFFBBF24),
    'is_hayati':        Color(0xFFA78BFA),
    'iliskiler':        Color(0xFFFB7185),
    'yeniden_baslamak': Color(0xFF6EE7B7),
    'annelik':          Color(0xFFF9A8D4),
    'cesaret':          Color(0xFFFDBA74),
    'ozgurluk':         Color(0xFF5EEAD4),
  };

  static const Map<String, String> categoryLabels = {
    'yalnizlik':        'Yalnızlık',
    'aile':             'Aile',
    'is_hayati':        'İş Hayatı',
    'iliskiler':        'İlişkiler',
    'yeniden_baslamak': 'Yeniden Başlamak',
    'annelik':          'Annelik',
    'cesaret':          'Cesaret',
    'ozgurluk':         'Özgürlük',
  };

  static Color categoryColor(String key) =>
      categoryColors[key] ?? const Color(0xFFA78BFA);

  static String categoryLabel(String key) =>
      categoryLabels[key] ?? key;
}

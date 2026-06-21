import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

abstract final class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        brightness:   Brightness.dark,
        surface:      AppColors.background,
        surfaceContainerHighest: AppColors.card,
        primary:      AppColors.primary,
        secondary:    AppColors.accent,
        error:        AppColors.danger,
        onSurface:    AppColors.text,
        onPrimary:    AppColors.text,
        outline:      AppColors.cardBorder,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      appBarTheme: AppBarTheme(
        backgroundColor:    Colors.transparent,
        elevation:          0,
        scrolledUnderElevation: 0,
        centerTitle:        true,
        titleTextStyle:     GoogleFonts.manrope(
          fontSize:       18,
          fontWeight:     FontWeight.w700,
          color:          AppColors.text,
          letterSpacing:  -0.3,
        ),
        iconTheme:          const IconThemeData(color: AppColors.text),
        systemOverlayStyle: const SystemUiOverlayStyle(
          statusBarColor:           Colors.transparent,
          statusBarIconBrightness:  Brightness.light,
          statusBarBrightness:      Brightness.dark,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor:      AppColors.card,
        selectedItemColor:    AppColors.accent,
        unselectedItemColor:  AppColors.textMuted,
        type:                 BottomNavigationBarType.fixed,
        elevation:            0,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled:           true,
        fillColor:        AppColors.card,
        hintStyle:        const TextStyle(color: AppColors.textMuted, fontSize: 14),
        contentPadding:   const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        enabledBorder:    OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide:   const BorderSide(color: AppColors.cardBorder, width: 1),
        ),
        focusedBorder:    OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide:   const BorderSide(color: AppColors.primary, width: 1.5),
        ),
        errorBorder:      OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide:   const BorderSide(color: AppColors.danger, width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide:   const BorderSide(color: AppColors.danger, width: 1.5),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor:  AppColors.primary,
          foregroundColor:  AppColors.text,
          minimumSize:      const Size.fromHeight(52),
          shape:            RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation:    0,
          textStyle:    GoogleFonts.inter(
            fontSize:   15,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.accent,
          textStyle:       GoogleFonts.inter(
            fontSize:   14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor:    AppColors.card,
        selectedColor:      AppColors.primary.withValues(alpha: 0.25),
        labelStyle:         const TextStyle(color: AppColors.textSecondary, fontSize: 13),
        side:               const BorderSide(color: AppColors.cardBorder),
        shape:              RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        padding:            const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),
      dividerTheme: const DividerThemeData(
        color:   AppColors.cardBorder,
        space:   1,
        thickness: 1,
      ),
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.android: CupertinoPageTransitionsBuilder(),
          TargetPlatform.iOS:     CupertinoPageTransitionsBuilder(),
        },
      ),
    );
  }
}

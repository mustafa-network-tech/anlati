import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

class GradientButton extends StatelessWidget {
  final String   label;
  final VoidCallback? onPressed;
  final bool     isLoading;
  final double   height;
  final IconData? icon;

  const GradientButton({
    super.key,
    required this.label,
    this.onPressed,
    this.isLoading = false,
    this.height    = 52,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      width:  double.infinity,
      child:  DecoratedBox(
        decoration: BoxDecoration(
          gradient:     onPressed != null
              ? AppColors.primaryGradient
              : const LinearGradient(colors: [Color(0xFF3F3F46), Color(0xFF3F3F46)]),
          borderRadius: BorderRadius.circular(16),
          boxShadow:    onPressed != null
              ? [BoxShadow(color: AppColors.primary.withValues(alpha: 0.35), blurRadius: 20, offset: const Offset(0, 6))]
              : null,
        ),
        child: ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style:     ElevatedButton.styleFrom(
            backgroundColor:  Colors.transparent,
            shadowColor:      Colors.transparent,
            minimumSize:      Size.fromHeight(height),
            shape:            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          child: isLoading
              ? const SizedBox(
                  width: 22, height: 22,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color:       Colors.white,
                  ),
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (icon != null) ...[
                      Icon(icon, size: 20),
                      const SizedBox(width: 8),
                    ],
                    Text(label, style: AppTextStyles.buttonText),
                  ],
                ),
        ),
      ),
    );
  }
}

class GhostButton extends StatelessWidget {
  final String   label;
  final VoidCallback? onPressed;
  final double   height;

  const GhostButton({
    super.key,
    required this.label,
    this.onPressed,
    this.height = 52,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      width:  double.infinity,
      child:  OutlinedButton(
        onPressed: onPressed,
        style:     OutlinedButton.styleFrom(
          side:             const BorderSide(color: AppColors.cardBorder, width: 1),
          shape:            RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          foregroundColor:  AppColors.textSecondary,
          minimumSize:      Size.fromHeight(height),
        ),
        child: Text(label, style: AppTextStyles.buttonText.copyWith(color: AppColors.textSecondary)),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../../core/theme/app_colors.dart';

class SkeletonBox extends StatelessWidget {
  final double  width;
  final double  height;
  final double  radius;

  const SkeletonBox({
    super.key,
    required this.width,
    required this.height,
    this.radius = 8,
  });

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor:      AppColors.card,
      highlightColor: AppColors.surfaceHigh,
      child:          Container(
        width:        width,
        height:       height,
        decoration:   BoxDecoration(
          color:        AppColors.card,
          borderRadius: BorderRadius.circular(radius),
        ),
      ),
    );
  }
}

class StoryCardSkeleton extends StatelessWidget {
  const StoryCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor:      AppColors.card,
      highlightColor: AppColors.surfaceHigh,
      child: Container(
        margin:       const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        padding:      const EdgeInsets.all(16),
        decoration:   BoxDecoration(
          color:        AppColors.card,
          borderRadius: BorderRadius.circular(20),
          border:       Border.all(color: AppColors.cardBorder, width: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cover skeleton
            Container(
              height: 160,
              decoration: BoxDecoration(
                color:        AppColors.surfaceHigh,
                borderRadius: BorderRadius.circular(14),
              ),
            ),
            const SizedBox(height: 14),
            // Category
            Container(width: 80, height: 24, color: AppColors.surfaceHigh,
              decoration: BoxDecoration(borderRadius: BorderRadius.circular(12), color: AppColors.surfaceHigh)),
            const SizedBox(height: 10),
            // Title lines
            Container(width: double.infinity, height: 18, color: AppColors.surfaceHigh),
            const SizedBox(height: 6),
            Container(width: 200, height: 18, color: AppColors.surfaceHigh),
            const SizedBox(height: 12),
            // Excerpt lines
            Container(width: double.infinity, height: 13, color: AppColors.surfaceHigh),
            const SizedBox(height: 4),
            Container(width: 250, height: 13, color: AppColors.surfaceHigh),
          ],
        ),
      ),
    );
  }
}

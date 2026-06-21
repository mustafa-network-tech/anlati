import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class CategoryBadge extends StatelessWidget {
  final String category;
  final bool   small;

  const CategoryBadge({
    super.key,
    required this.category,
    this.small = false,
  });

  @override
  Widget build(BuildContext context) {
    final color = AppColors.categoryColor(category);
    final label = AppColors.categoryLabel(category);

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: small ? 8 : 10,
        vertical:   small ? 3 : 5,
      ),
      decoration: BoxDecoration(
        color:        color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border:       Border.all(color: color.withValues(alpha: 0.25), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width:        small ? 5 : 6,
            height:       small ? 5 : 6,
            decoration:   BoxDecoration(
              color:        color,
              shape:        BoxShape.circle,
            ),
          ),
          SizedBox(width: small ? 5 : 6),
          Text(
            label,
            style: TextStyle(
              color:      color,
              fontSize:   small ? 11 : 12,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}

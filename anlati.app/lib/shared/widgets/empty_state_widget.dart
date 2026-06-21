import 'package:flutter/material.dart';
import '../../core/theme/app_text_styles.dart';
import 'gradient_button.dart';

class EmptyStateWidget extends StatelessWidget {
  final String  emoji;
  final String  title;
  final String  message;
  final String? actionLabel;
  final VoidCallback? onAction;

  const EmptyStateWidget({
    super.key,
    required this.emoji,
    required this.title,
    required this.message,
    this.actionLabel,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 64)),
            const SizedBox(height: 20),
            Text(
              title,
              style: AppTextStyles.headline.copyWith(fontSize: 20),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),
            Text(
              message,
              style: AppTextStyles.bodySecondary,
              textAlign: TextAlign.center,
            ),
            if (actionLabel != null && onAction != null) ...[
              const SizedBox(height: 28),
              SizedBox(
                width: 200,
                child: GradientButton(
                  label:     actionLabel!,
                  onPressed: onAction,
                  height:    48,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

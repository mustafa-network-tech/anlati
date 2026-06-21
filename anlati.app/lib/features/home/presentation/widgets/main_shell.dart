import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/constants/app_constants.dart';

class MainShell extends StatelessWidget {
  final Widget child;

  const MainShell({super.key, required this.child});

  static const _tabs = [
    AppRoutes.home,
    AppRoutes.explore,
    AppRoutes.write,
    AppRoutes.notifications,
    AppRoutes.profile,
  ];

  int _currentIndex(BuildContext context) {
    final loc = GoRouterState.of(context).matchedLocation;
    for (int i = 0; i < _tabs.length; i++) {
      if (loc.startsWith(_tabs[i])) return i;
    }
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final currentIndex = _currentIndex(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      body:            child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.card,
          border: const Border(
            top: BorderSide(color: AppColors.cardBorder, width: 1),
          ),
          boxShadow: [
            BoxShadow(
              color:       Colors.black.withValues(alpha: 0.4),
              blurRadius:  20,
              offset:      const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: SizedBox(
            height: 64,
            child: Row(
              children: [
                _NavItem(
                  icon:       Icons.home_outlined,
                  activeIcon: Icons.home_rounded,
                  label:      'Ana Sayfa',
                  isActive:   currentIndex == 0,
                  onTap:      () => context.go(AppRoutes.home),
                ),
                _NavItem(
                  icon:       Icons.search_rounded,
                  activeIcon: Icons.search_rounded,
                  label:      'Keşfet',
                  isActive:   currentIndex == 1,
                  onTap:      () => context.go(AppRoutes.explore),
                ),
                // Write FAB
                Expanded(
                  child: GestureDetector(
                    onTap: () => context.go(AppRoutes.write),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width:      52,
                          height:     52,
                          decoration: BoxDecoration(
                            gradient:     AppColors.primaryGradient,
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color:       AppColors.primary.withValues(alpha: 0.4),
                                blurRadius:  16,
                                offset:      const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.edit_rounded,
                            color: Colors.white,
                            size:  24,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                _NavItem(
                  icon:       Icons.notifications_outlined,
                  activeIcon: Icons.notifications_rounded,
                  label:      'Bildirimler',
                  isActive:   currentIndex == 3,
                  onTap:      () => context.go(AppRoutes.notifications),
                ),
                _NavItem(
                  icon:       Icons.person_outline_rounded,
                  activeIcon: Icons.person_rounded,
                  label:      'Profil',
                  isActive:   currentIndex == 4,
                  onTap:      () => context.go(AppRoutes.profile),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData  icon;
  final IconData  activeIcon;
  final String    label;
  final bool      isActive;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap:     onTap,
        behavior:  HitTestBehavior.opaque,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 200),
              child:    Icon(
                isActive ? activeIcon : icon,
                key:   ValueKey(isActive),
                color: isActive ? AppColors.accent : AppColors.textMuted,
                size:  24,
              ),
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                color:      isActive ? AppColors.accent : AppColors.textMuted,
                fontSize:   10,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
            const SizedBox(height: 2),
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width:    isActive ? 16 : 0,
              height:   3,
              decoration: BoxDecoration(
                color:        AppColors.accent,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

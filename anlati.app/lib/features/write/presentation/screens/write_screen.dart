import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../shared/widgets/gradient_button.dart';
import '../../../home/data/stories_repository.dart';
import '../../../home/domain/stories_provider.dart';

class WriteScreen extends ConsumerStatefulWidget {
  const WriteScreen({super.key});

  @override
  ConsumerState<WriteScreen> createState() => _WriteScreenState();
}

class _WriteScreenState extends ConsumerState<WriteScreen> {
  final _titleCtrl   = TextEditingController();
  final _summaryCtrl = TextEditingController();
  final _contentCtrl = TextEditingController();
  bool  _isAnon      = false;
  bool  _isLoading   = false;
  String? _category;

  static const _categories = {
    'yalnizlik':        'Yalnızlık',
    'aile':             'Aile',
    'is_hayati':        'İş Hayatı',
    'iliskiler':        'İlişkiler',
    'yeniden_baslamak': 'Yeniden Başlamak',
    'annelik':          'Annelik',
    'cesaret':          'Cesaret',
    'ozgurluk':         'Özgürlük',
  };

  int get _wordCount =>
      _contentCtrl.text.trim().split(RegExp(r'\s+')).where((w) => w.isNotEmpty).length;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _summaryCtrl.dispose();
    _contentCtrl.dispose();
    super.dispose();
  }

  Future<void> _publish({required bool asDraft}) async {
    if (_titleCtrl.text.trim().isEmpty) {
      _showError('Başlık boş bırakılamaz.');
      return;
    }
    if (_contentCtrl.text.trim().isEmpty) {
      _showError('Hikâye içeriği boş olamaz.');
      return;
    }
    if (_category == null) {
      _showError('Bir kategori seç.');
      return;
    }

    final userId = Supabase.instance.client.auth.currentUser?.id;
    if (userId == null) {
      context.go('/auth/login');
      return;
    }

    setState(() => _isLoading = true);
    try {
      await StoriesRepository.instance.createStory(
        authorId:    userId,
        title:       _titleCtrl.text.trim(),
        summary:     _summaryCtrl.text.trim().isNotEmpty
            ? _summaryCtrl.text.trim()
            : _contentCtrl.text.trim().substring(
                0,
                _contentCtrl.text.trim().length.clamp(0, 160),
              ),
        fullText:    _contentCtrl.text.trim(),
        category:    _category!,
        isAnonymous: _isAnon,
        isPublished: !asDraft,
      );

      ref.invalidate(storiesProvider(null));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content:         Text(asDraft ? 'Taslak kaydedildi.' : 'Hikâye yayınlandı! 🎉'),
            backgroundColor: AppColors.card,
          ),
        );
        context.go('/home');
      }
    } catch (e) {
      _showError(e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showError(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content:         Text(msg),
        backgroundColor: AppColors.danger.withValues(alpha: 0.9),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        leading: IconButton(
          icon:      const Icon(Icons.close_rounded),
          onPressed: () => context.go('/home'),
        ),
        title:   const Text('Hikâye Yaz'),
        actions: [
          TextButton(
            onPressed: () => _publish(asDraft: true),
            child:     Text('Taslak', style: AppTextStyles.bodySmall.copyWith(color: AppColors.textMuted)),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Kelime sayacı
            Container(
              height: 36,
              color:  AppColors.card,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  const Icon(Icons.edit_note_rounded, size: 16, color: AppColors.textMuted),
                  const SizedBox(width: 8),
                  AnimatedBuilder(
                    animation: _contentCtrl,
                    builder: (_, __) => Text(
                      '$_wordCount kelime',
                      style: AppTextStyles.labelMuted,
                    ),
                  ),
                  const Spacer(),
                  const Icon(Icons.auto_awesome, size: 14, color: AppColors.accent),
                  const SizedBox(width: 4),
                  Text('AI Asistan', style: AppTextStyles.labelMuted.copyWith(color: AppColors.accent)),
                ],
              ),
            ),

            // Form
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Başlık
                    TextField(
                      controller: _titleCtrl,
                      style:      AppTextStyles.headline.copyWith(fontSize: 24),
                      maxLines:   2,
                      decoration: InputDecoration(
                        hintText:        'Hikâyenin başlığı…',
                        hintStyle:       AppTextStyles.headline.copyWith(
                          fontSize: 24,
                          color:    AppColors.textMuted,
                        ),
                        border:          InputBorder.none,
                        contentPadding:  EdgeInsets.zero,
                        filled:          false,
                      ),
                    ),

                    const SizedBox(height: 12),

                    // Özet (isteğe bağlı)
                    TextField(
                      controller: _summaryCtrl,
                      style:      AppTextStyles.bodySecondary,
                      maxLines:   2,
                      decoration: InputDecoration(
                        hintText:       'Kısa bir özet (isteğe bağlı)…',
                        hintStyle:      AppTextStyles.bodySecondary.copyWith(color: AppColors.textMuted),
                        border:         InputBorder.none,
                        contentPadding: EdgeInsets.zero,
                        filled:         false,
                      ),
                    ),

                    const Divider(color: AppColors.cardBorder, height: 32),

                    // Kategori seçimi
                    Text('Kategori', style: AppTextStyles.label),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing:  8,
                      runSpacing: 8,
                      children: _categories.entries.map((entry) {
                        final isSelected = _category == entry.key;
                        final color = AppColors.categoryColor(entry.key);
                        return GestureDetector(
                          onTap: () => setState(() => _category = entry.key),
                          child: AnimatedContainer(
                            duration:   const Duration(milliseconds: 180),
                            padding:    const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color:        isSelected
                                  ? color.withValues(alpha: 0.2)
                                  : AppColors.card,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: isSelected ? color : AppColors.cardBorder,
                              ),
                            ),
                            child: Text(
                              entry.value,
                              style: TextStyle(
                                color:      isSelected ? color : AppColors.textMuted,
                                fontSize:   13,
                                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: 24),

                    // İçerik
                    Text('Hikâye', style: AppTextStyles.label),
                    const SizedBox(height: 10),
                    Container(
                      decoration: BoxDecoration(
                        color:        AppColors.card,
                        borderRadius: BorderRadius.circular(16),
                        border:       Border.all(color: AppColors.cardBorder),
                      ),
                      padding: const EdgeInsets.all(16),
                      child:   TextField(
                        controller: _contentCtrl,
                        style:      AppTextStyles.body.copyWith(height: 1.75),
                        maxLines:   null,
                        minLines:   10,
                        decoration: InputDecoration(
                          hintText:       'Hikâyeni burada anlat…\n\nKimse seni yargılamak için değil, anlamak için burada.',
                          hintStyle:      AppTextStyles.body.copyWith(
                            color:  AppColors.textMuted,
                            height: 1.75,
                          ),
                          border:         InputBorder.none,
                          contentPadding: EdgeInsets.zero,
                          filled:         false,
                        ),
                        onChanged: (_) => setState(() {}),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // AI Yardım butonları
                    Text('AI Asistan', style: AppTextStyles.label),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8, runSpacing: 8,
                      children: const [
                        _AiChip(label: '✨ İyileştir',       hint: 'Yakında'),
                        _AiChip(label: '📝 Başlık Üret',     hint: 'Yakında'),
                        _AiChip(label: '🔒 Anonimleştir',    hint: 'Yakında'),
                        _AiChip(label: '🔤 Yazım Düzelt',    hint: 'Yakında'),
                      ],
                    ),

                    const SizedBox(height: 28),

                    // Anonim toggle
                    GestureDetector(
                      onTap: () => setState(() => _isAnon = !_isAnon),
                      child: Container(
                        padding:    const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color:        _isAnon
                              ? AppColors.surfaceHigh
                              : AppColors.card,
                          borderRadius: BorderRadius.circular(16),
                          border:       Border.all(
                            color: _isAnon
                                ? AppColors.textSecondary.withValues(alpha: 0.3)
                                : AppColors.cardBorder,
                          ),
                        ),
                        child: Row(
                          children: [
                            Text(_isAnon ? '🎭' : '👤', style: const TextStyle(fontSize: 24)),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    _isAnon ? 'Anonim Yayınla' : 'İsimle Yayınla',
                                    style: AppTextStyles.titleMedium,
                                  ),
                                  Text(
                                    _isAnon
                                        ? 'Kimliğin gizli kalır'
                                        : 'Profilinde görünür',
                                    style: AppTextStyles.bodySmall,
                                  ),
                                ],
                              ),
                            ),
                            Switch.adaptive(
                              value:              _isAnon,
                              onChanged:          (v) => setState(() => _isAnon = v),
                              activeThumbColor:   AppColors.accent,
                              activeTrackColor:   AppColors.accent.withValues(alpha: 0.4),
                              inactiveThumbColor: AppColors.textMuted,
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Yayınla
                    GradientButton(
                      label:     'Yayınla',
                      onPressed: () => _publish(asDraft: false),
                      isLoading: _isLoading,
                      icon:      Icons.send_rounded,
                    ),

                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AiChip extends StatelessWidget {
  final String label;
  final String hint;

  const _AiChip({required this.label, required this.hint});

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: hint,
      child:   Container(
        padding:    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color:        AppColors.card,
          borderRadius: BorderRadius.circular(20),
          border:       Border.all(color: AppColors.accent.withValues(alpha: 0.2)),
        ),
        child: Text(
          label,
          style: AppTextStyles.bodySmall.copyWith(
            color: AppColors.accent,
          ),
        ),
      ),
    );
  }
}

import '../../shared/models/story_model.dart';

/// Demo hikâyeler — Supabase boş döndüğünde gösterilir.
/// ID'ler "mock_" ile başlar; repository bu prefix ile gerçek/mock ayrımı yapar.
abstract final class MockStories {
  static List<StoryModel> get all => _stories;

  static List<StoryModel> byCategory(String? category) {
    if (category == null) return _stories;
    return _stories.where((s) => s.category == category).toList();
  }

  static StoryModel? byId(String id) {
    try {
      return _stories.firstWhere((s) => s.id == id);
    } catch (_) {
      return null;
    }
  }

  static const _authorId = '00000000-0000-0000-0000-000000000000';

  static final List<StoryModel> _stories = [
    // ── 1. Yalnızlık ──────────────────────────────────────────────
    StoryModel(
      id:          'mock_001',
      authorId:    _authorId,
      title:       'Şehrin Ortasında Tek Başına',
      summary:     'Milyonlarca insanın arasında kendimi hiç bu kadar yalnız hissetmemiştim. Her sabah metrodan inerken yüzler görüyordum ama hiçbiri beni tanımıyordu.',
      fullText:    '''İstanbul'a taşındığımda her şeyin değişeceğini düşünüyordum. Yeni bir şehir, yeni bir hayat, yeni insanlar. Ama kimse sana şehrin seni nasıl yutabileceğini söylemez.

Her sabah metrodan inerken yüzler görüyordum. Binlerce yüz. Hepsi bir yere koşuyor, hepsi birileriyle konuşuyor, hepsi bir şeylere güliyor. Ama hiçbiri beni tanımıyordu.

Akşamları eve döndüğümde en çok konuştuğum kişi marketteki kasiyer oluyordu. "İyi akşamlar" diyordum, o "İyi akşamlar" diyordu. Bu kadar.

Bir gün balkonuma çıktım. Karşı binada bir aile akşam yemeği yiyordu. Çocuklar gülüyordu, annesi bir şeyler anlatıyordu. O pencereye bakarak fark ettim: Yalnızlık insanların yokluğu değil, onların seni görmemesi.

Birkaç ay sonra bir yazı grubuyla tanıştım. O gün her şey değişmeye başladı.''',
      category:    'yalnizlik',
      isAnonymous: false,
      isPublished: true,
      likeCount:   284,
      commentCount: 47,
      readCount:   1820,
      shareCount:  33,
      createdAt:   DateTime(2025, 3, 14),
      updatedAt:   DateTime(2025, 3, 14),
      authorName:  'Elif S.',
    ),

    // ── 2. Aile ───────────────────────────────────────────────────
    StoryModel(
      id:          'mock_002',
      authorId:    _authorId,
      title:       'Babamın Son Mektubu',
      summary:     'Babam hiç kolay bir insan değildi. Ama öldükten sonra çekmecesinde bulduğum o mektup, onu yeniden tanımamı sağladı.',
      fullText:    '''Babam hiç kolay bir insan değildi. Bunu söylemek bile garip geliyor artık; çünkü "kolay olmayan" biri için bu kadar çok ağlamak tuhaf hissettiriyor.

Evini boşaltırken çekmecesini açtım. Sararmış bir zarf. Üzerinde benim adım.

Mektubu okuduğumda ellerim titriyordu. Babam hiç o kadar çok şey söylememişti bana yüz yüze. Hiç "seni seviyorum" demesini duymamıştım. Ama o mektupta, o bozuk yazısıyla, her şeyi yazmıştı.

"Nasıl söyleyeceğimi bilemedim" diyordu. "Ama bilmeni istedim."

Bazı insanlar sevgilerini göstermeyi öğrenemeden gidiyorlar. Bu onların en büyük trajedisi. Ve bizim de.''',
      category:    'aile',
      isAnonymous: false,
      isPublished: true,
      likeCount:   631,
      commentCount: 89,
      readCount:   4210,
      shareCount:  112,
      createdAt:   DateTime(2025, 1, 22),
      updatedAt:   DateTime(2025, 1, 22),
      authorName:  'Derya K.',
    ),

    // ── 3. İş Hayatı ──────────────────────────────────────────────
    StoryModel(
      id:          'mock_003',
      authorId:    _authorId,
      title:       'İstifa Ettiğim Gün Özgür Oldum',
      summary:     '8 yıl aynı şirkette çalıştım. Bir sabah toplantıda fark ettim: Bu odada olmak istemiyorum. Öğleden sonra istifa ettim.',
      fullText:    '''8 yıl. Aynı ofis, aynı masa, aynı kahve makinesi. Sabah 8.30'da girip akşam 7'de çıkmak. Hafta sonları da mail atmak.

O toplantıda bir şey oldu. Müdürüm konuşurken kendimi dışarıdan izledim. Masanın etrafındaki insanlara baktım. Hepimiz yorgundu. Hepimiz bıkmıştık. Ama kimse bunu söylemiyordu.

"Ben burada olmak istemiyorum."

Bu cümle aklıma o kadar net geldi ki sesli söyleyip söylemediğimi bilemedim. Söylememiştim. Ama kararım verilmişti.

Öğleden sonra istifa ettim. İK görevlisi şaşırdı. "Başka teklifiniz mi var?" dedi. "Hayır" dedim. "Sadece gitmeyi seçiyorum."

O gün eve dönerken güneş her zamankinden farklı görünüyordu.''',
      category:    'is_hayati',
      isAnonymous: false,
      isPublished: true,
      likeCount:   512,
      commentCount: 73,
      readCount:   3640,
      shareCount:  88,
      createdAt:   DateTime(2025, 4, 5),
      updatedAt:   DateTime(2025, 4, 5),
      authorName:  'Anonim',
    ),

    // ── 4. İlişkiler ──────────────────────────────────────────────
    StoryModel(
      id:          'mock_004',
      authorId:    _authorId,
      title:       'Seni Bırakmak Beni Kurtardı',
      summary:     'Herkes "ne kadar güzel çifttiniz" diyordu. Ama hiç kimse kapı kapandığında ne yaşadığımızı bilmiyordu.',
      fullText:    '''Herkes "ne kadar güzel çifttiniz" diyordu. Fotoğraflarda gerçekten öyle görünüyorduk. İki mutlu insan.

Ama fotoğraflar sadece bir saniyeyi gösterir.

Kapı kapandığında başka bir hayatımız vardı. Sessizlik. Soğuk bakışlar. Söylenmeyen kelimeler. Ve en kötüsü: Yanlış biri için kendimi her gün biraz daha küçülttüğümü hissetmek.

Ayrılmak için 14 ay beklettim kendimi. Çünkü "belki düzelir" diyordum. "Belki ben yanlış yapıyorum." "Belki tahammül etmek gerekiyor."

Gittiğim gün ağladım. Ama o gözyaşları üzüntüden değildi. Rahatlıktan.

Kendime şunu söyledim: "Seni bırakmak beni kurtardı."''',
      category:    'iliskiler',
      isAnonymous: true,
      isPublished: true,
      likeCount:   897,
      commentCount: 134,
      readCount:   6780,
      shareCount:  201,
      createdAt:   DateTime(2025, 2, 11),
      updatedAt:   DateTime(2025, 2, 11),
      authorName:  'Anonim',
    ),

    // ── 5. Annelik ────────────────────────────────────────────────
    StoryModel(
      id:          'mock_005',
      authorId:    _authorId,
      title:       'Anneliğin Kimseye Söylemediğim Yüzü',
      summary:     'Herkes anneliğin ne kadar güzel olduğunu söylüyor. Ben size kimsenin söylemediği tarafını anlatacağım.',
      fullText:    '''Bebek dünyaya geldiğinde ağladım. Herkes "sevinçten ağlıyor" dedi. Bir kısmı doğruydu.

Ama kimse yorgunluktan ağladığımı söyleyemezdim.

3 hafta boyunca 4 saatten fazla uyumadım. Bebeğim ağladığında ne yapacağımı bilmiyordum. Doğru yapıyor muyum? Yanlış mı yapıyorum? Neden bu kadar zor?

"Doğal içgüdü devreye girer" demişlerdi. Girmedi. Ya da girdi ama ben fark edemedim.

Bir gece saat 3'te, bebek kollarımda, ben ağlarken eşim uyurken fark ettim: Kimse bana bunun böyle olabileceğini söylememişti. Kimse "zor hissedersen bu normal" dememişti.

Bu hikâyeyi yazdım çünkü o geceleri yaşayan birileri bunu okusun diye. İyi bir anne olmak için mutlu görünmek zorunda değilsin.''',
      category:    'annelik',
      isAnonymous: false,
      isPublished: true,
      likeCount:   743,
      commentCount: 156,
      readCount:   5920,
      shareCount:  267,
      createdAt:   DateTime(2025, 5, 19),
      updatedAt:   DateTime(2025, 5, 19),
      authorName:  'Zeynep A.',
    ),

    // ── 6. Cesaret ────────────────────────────────────────────────
    StoryModel(
      id:          'mock_006',
      authorId:    _authorId,
      title:       'Doktora Hayır Dediğim Gün',
      summary:     '40 yaşında tıp fakültesine girdiğimde herkes deli dedi. Şimdi 3. sınıftayım ve hayatımda hiç bu kadar doğru bir yerde olmadım.',
      fullText:    '''40 yaşımda tıp fakültesine giriş sınavına girdim.

Eşim şok oldu. Çocuklarım şaşırdı. Annem "bu yaştan sonra ne tıbbı" dedi. İş arkadaşlarım güldü.

Ben de korkuyordum. Ama daha çok korktuğum bir şey vardı: 70 yaşında geriye bakıp "keşke deneyeydim" demek.

Sınavı kazandım.

Şimdi 3. sınıftayım. Sınıfımın en yaşlısıyım. Bazen öğrencilerim beni "hoca" sanıyor. Bazen yaşım yüzünden dalga geçenler oluyor.

Ama her sabah üniversiteye giderken bir şey hissediyorum: Bu benim hayatım. Ve ben onu yaşıyorum.

Cesaret yaştan bağımsızdır.''',
      category:    'cesaret',
      isAnonymous: false,
      isPublished: true,
      likeCount:   1024,
      commentCount: 198,
      readCount:   8450,
      shareCount:  342,
      createdAt:   DateTime(2025, 6, 1),
      updatedAt:   DateTime(2025, 6, 1),
      authorName:  'Dr. Aday S.',
    ),

    // ── 7. Yeniden Başlamak ────────────────────────────────────────
    StoryModel(
      id:          'mock_007',
      authorId:    _authorId,
      title:       'Yangından Sonra',
      summary:     'Her şeyimi kaybettim. Ev, iş, ilişki. Aynı yıl içinde. Ama o yılın sonunda hayatımın en temiz sayfasına baş koydum.',
      fullText:    '''Ocak: Yangın çıktı ve evim yandı.
Nisan: Şirket kapandı ve işimi kaybettim.
Temmuz: 7 yıllık ilişkim bitti.

Bunları tek tek yaşasam belki kaldırırdım. Ama üçü aynı yıl içinde.

Kasım'da bir arkadaşımın odasının köşesine yerleşmiştim. Bavulumda birkaç kıyafet, çantamda bozuk param vardı. Telefonuma bakıp kendime soruyordum: "Şimdi ne yapacağım?"

O sorunun cevabı gelmedi hemen. Ama gelmedi diye durmadım.

Küçük başladım. Bir iş buldum. Küçük bir oda kiraladım. Tekrar yazmaya başladım. Her gün biraz daha.

Yıl sona erdiğinde geriye baktım. O yıl her şeyimi kaybetmiştim. Ama o yılın sonunda kendimi bulmuştum.

Yangından sonra daha temiz bir şey inşa edebilirsin.''',
      category:    'yeniden_baslamak',
      isAnonymous: false,
      isPublished: true,
      likeCount:   1156,
      commentCount: 212,
      readCount:   9320,
      shareCount:  389,
      createdAt:   DateTime(2025, 7, 8),
      updatedAt:   DateTime(2025, 7, 8),
      authorName:  'Canan D.',
    ),

    // ── 8. Özgürlük ───────────────────────────────────────────────
    StoryModel(
      id:          'mock_008',
      authorId:    _authorId,
      title:       'Pasaportumu İlk Kez Kullandığım Gün',
      summary:     '34 yaşında ilk kez yurt dışına çıktım. Bavulumu açarken fark ettim: Korkularımı da paketlemişim.',
      fullText:    '''34 yaşında pasaportumu ilk kez kullandım.

Herkes seyahat ediyordu. Sosyal medya hep başka şehirler, başka ülkeler. Ben de "bir gün gideceğim" diyordum. Ama hep bir şey engelliyordu. Para. Zaman. Cesaret.

En çok cesaret.

Yalnız çıktım. Roma'ya. Tek kişilik bilet, tek kişilik oda.

Bavulumu açarken fark ettim: Korkularımı da paketlemişim. "Ya kaybolursam? Ya bir şey olursa? Ya yanlış bir şey yaparım?"

Ama sonra dışarı çıktım. Cobblestone sokaklarda yürüdüm. Kimsenin tanımadığı biri olarak. Sadece ben.

Ve o his — o "kimsenin beni görmediği, sadece var olduğum" his — en büyük özgürlüktü.

Korkular gerçek. Ama hayat onların ötesinde.''',
      category:    'ozgurluk',
      isAnonymous: false,
      isPublished: true,
      likeCount:   678,
      commentCount: 91,
      readCount:   4830,
      shareCount:  145,
      createdAt:   DateTime(2025, 8, 20),
      updatedAt:   DateTime(2025, 8, 20),
      authorName:  'Selin T.',
    ),

    // ── 9. Yalnızlık (ekstra) ─────────────────────────────────────
    StoryModel(
      id:          'mock_009',
      authorId:    _authorId,
      title:       'Pazar Sabahları',
      summary:     'Pazar sabahları sevilmiyorum. Çünkü herkesin birlikte kahvaltı ettiği saatlerde ben yalnızım ve bu çok ağır geliyor.',
      fullText:    '''Haftanın en zor günü Pazar sabahı.

Cumartesi geçiyor bir şekilde. İş var, alışveriş var, plan var. Ama Pazar sabahı dünyayı yavaşlatıyor. Ve o yavaşlıkta her şey daha net görünüyor.

Komşudan kahvaltı sesleri geliyor. Karşı balkondan çocuk gülüşmeleri. Ekranımda herkesin kahvaltı fotoğrafları.

Ve ben, soğuk kahvemle, yalnız.

Bunu yazmak ne kadar tuhaf. "Pazar sabahı yalnız olmak" — bu ne kadar sıradan bir şey gibi görünüyor dışarıdan. Ama içeriden öyle değil.

İçeriden, Pazar sabahları dünyanın senden büyük olduğunu hatırlatıyor.

Sonra öğlen oluyor. Ve geçiyor.

Ama o sabahın ağırlığı her Pazar biraz daha tanıdık geliyor.''',
      category:    'yalnizlik',
      isAnonymous: true,
      isPublished: true,
      likeCount:   445,
      commentCount: 62,
      readCount:   2980,
      shareCount:  57,
      createdAt:   DateTime(2025, 9, 7),
      updatedAt:   DateTime(2025, 9, 7),
      authorName:  'Anonim',
    ),

    // ── 10. Aile (ekstra) ─────────────────────────────────────────
    StoryModel(
      id:          'mock_010',
      authorId:    _authorId,
      title:       'Annem Gibi Olmayacağıma Yemin Etmiştim',
      summary:     'Yıllarca "annem gibi olmayacağım" dedim. Kızıma bağırdığım gün aynada annemin yüzünü gördüm.',
      fullText:    '''Büyürken hep şunu düşündüm: "Ben annem gibi olmayacağım."

Annem sert bir kadındı. Sınırları vardı, sesi çıkıyordu, kolay şefkat göstermiyordu. Ben farklı olacaktım. Daha yumuşak, daha anlayışlı, daha sabırlı.

Kızım 4 yaşındaydı. Uzun bir günün sonunda oyuncaklarını dağıtmıştı yine. Ben de yorgundum, sinirliydim, bardağım dolmuştu.

Bağırdım.

Kızım şaşkın gözlerle baktı bana. Ve o bakış aynaya döndü. Aynada annemin yüzünü gördüm.

O gece kızım uyuduktan sonra uzun süre otururdum. Annem de böyle bir günün sonundan mı bağırmıştı? O da bu kadar yorgun muydu?

Annem gibi olmayacağım diye yemin etmiştim. Ama belki annem de öyle yemin etmişti.

Bazı şeyleri anlamak için anne olmak gerekiyor.''',
      category:    'aile',
      isAnonymous: false,
      isPublished: true,
      likeCount:   892,
      commentCount: 178,
      readCount:   7210,
      shareCount:  284,
      createdAt:   DateTime(2025, 10, 3),
      updatedAt:   DateTime(2025, 10, 3),
      authorName:  'Neslihan B.',
    ),
  ];
}

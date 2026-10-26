# 品牌字体查找，被 setup.sh 和 new_film.sh 引用（. fonts.sh）。需要先设好 SKILL=<skill 根目录>。
# 查找顺序：skill 自带的 brand/fonts → $LAIYE_FONTS（公司共享的字体目录）→ 系统字体目录。
# 汉仪雅酷黑、TT Supermolot Neue 是来也公司授权字体：仓库不带它们时，从公司「通用素材/字体-公司版权」装到系统里，或设 LAIYE_FONTS。
BRAND_FONTS="HYYakuHei-85W.ttf TTSupermolotNeue-Bold.otf TTSupermolotNeue-DemiBold.otf Inter.ttf JetBrainsMono.ttf"
HAN_FONTS="SourceHanSansSC-Regular.otf SourceHanSansSC-Medium.otf SourceHanSansSC-Bold.otf"

# 系统里常见的另一种文件名
font_alts() {
  case $1 in
    TTSupermolotNeue-Bold.otf) echo "TypeType - TT Supermolot Neue Bold.otf|TT-Supermolot-Neue-Bold.otf" ;;
    TTSupermolotNeue-DemiBold.otf) echo "TypeType - TT Supermolot Neue DemiBold.otf|TT-Supermolot-Neue-DemiBold.otf" ;;
  esac
}

# font_path <标准文件名> → 打印找到的路径；找不到返回 1
font_path() {
  for d in "$SKILL/brand/fonts" "$LAIYE_FONTS" "$HOME/Library/Fonts" /Library/Fonts "$HOME/.local/share/fonts" "$HOME/.fonts" /usr/share/fonts /usr/local/share/fonts; do
    [ -n "$d" ] && [ -d "$d" ] || continue
    [ -f "$d/$1" ] && { echo "$d/$1"; return 0; }
    _old=$IFS; IFS='|'
    for a in $(font_alts "$1"); do [ -f "$d/$a" ] && { IFS=$_old; echo "$d/$a"; return 0; }; done
    IFS=$_old
  done
  return 1
}

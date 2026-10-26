"""从截图取色，做产品界面的 ui-tokens 用。
   python sample_colors.py <截图> x,y [x,y …]      每个点取 5×5 像素的中位色，打印十六进制
   python sample_colors.py <截图> --top 12        列出整张图里最常见的 12 种颜色（找底色、分隔线、气泡色）
用引擎的 Python 运行（带 Pillow）：$LIB/.venv/bin/python -I sample_colors.py …"""
import sys
from collections import Counter
from PIL import Image

if len(sys.argv) < 3:
    print(__doc__); sys.exit(2)
im = Image.open(sys.argv[1]).convert('RGB')
hx = lambda c: '#%02X%02X%02X' % c
if sys.argv[2] == '--top':
    n = int(sys.argv[3]) if len(sys.argv) > 3 else 12
    small = im.copy(); small.thumbnail((640, 640))
    data = small.get_flattened_data() if hasattr(small, 'get_flattened_data') else small.getdata()
    q = Counter(tuple(v // 4 * 4 for v in px) for px in data)
    total = sum(q.values())
    for c, k in q.most_common(n): print(f'{hx(c)}  {k / total * 100:5.1f}%')
else:
    for arg in sys.argv[2:]:
        x, y = map(int, arg.split(','))
        box = [im.getpixel((min(max(x + dx, 0), im.width - 1), min(max(y + dy, 0), im.height - 1))) for dx in range(-2, 3) for dy in range(-2, 3)]
        med = tuple(sorted(c[i] for c in box)[len(box) // 2] for i in range(3))
        print(f'{arg:>12}  {hx(med)}')

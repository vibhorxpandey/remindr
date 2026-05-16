"""Generate PWA icons for Remindr using only stdlib."""
import struct, zlib, os

def png_chunk(chunk_type: bytes, data: bytes) -> bytes:
    c = chunk_type + data
    return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)

def make_png(size: int) -> bytes:
    # Draw a simple indigo rounded square with a white "R"
    # We'll make a solid indigo square (no true rounding at pixel level for simplicity)
    R, G, B = 99, 102, 241  # indigo-500
    DR, DG, DB = 15, 15, 26  # dark-900 background

    rows = []
    pad = size // 8
    for y in range(size):
        row = [0]  # filter byte
        for x in range(size):
            in_square = pad <= x < size - pad and pad <= y < size - pad
            if in_square:
                # Simple "R" glyph in center
                cx = x - size // 2
                cy = y - size // 2
                ch_w = size // 5
                ch_h = size // 3
                # Vertical stem
                on_stem = -ch_w // 2 <= cx <= -ch_w // 2 + max(2, size // 32) and -ch_h // 2 <= cy <= ch_h // 2
                # Top arc (upper half circle approximation)
                arc_cx = -ch_w // 2 + ch_w // 2
                arc_r = ch_w // 2
                in_arc = (cx - arc_cx) ** 2 + cy ** 2 <= arc_r ** 2 and cy < 0
                # Diagonal leg
                on_leg = (cx >= 0 and cy >= 0 and abs(cy - cx * 0.8) < max(1, size // 40))
                if on_stem or in_arc or on_leg:
                    row += [255, 255, 255]
                else:
                    row += [R, G, B]
            else:
                row += [DR, DG, DB]
        rows.append(bytes(row))

    raw = b''.join(rows)
    compressed = zlib.compress(raw, 9)

    sig = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    ihdr = png_chunk(b'IHDR', ihdr_data)
    idat = png_chunk(b'IDAT', compressed)
    iend = png_chunk(b'IEND', b'')
    return sig + ihdr + idat + iend

out_dir = os.path.join(os.path.dirname(__file__), 'frontend', 'public', 'icons')
os.makedirs(out_dir, exist_ok=True)

for size in (192, 512):
    path = os.path.join(out_dir, f'icon-{size}.png')
    with open(path, 'wb') as f:
        f.write(make_png(size))
    print(f'Created {path}')

print('Icons generated!')

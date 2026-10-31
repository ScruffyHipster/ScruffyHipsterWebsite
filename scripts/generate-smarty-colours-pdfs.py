#!/usr/bin/env python3
"""Build the committed SmartyColours printables from the reviewed artwork catalogue.

Development-only dependencies are listed in PDFrequirements.dev.txt. The website
build serves the committed PDFs and does not run this script or need Python.
Example: python scripts/generate-smarty-colours-pdfs.py --pack-offset 0 --pack-count 8
Run --validate-only to inspect every final PDF without tracing or writing PDFs.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
from pathlib import Path

from PIL import Image
from pypdf import PdfReader
from pypdf.generic import ContentStream
from reportlab.graphics import renderPDF
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont as ReportLabFont
from reportlab.pdfgen import canvas

DOMAIN = "scruffyhipster.com"
SIZES = {"a4": A4, "letter": letter}
APP_SENTENCE = "Colour more pictures in the SmartyColours app on iPad and iPhone"
MARGIN = 10 * mm
HEADER = 20 * mm
GAP = 6 * mm
FOOTER = 29 * mm
ART_PADDING = 4 * mm
FRAME = 1.2 * mm
MIN_ART_STROKE = 2.5  # points, applied after the vector paths are scaled to paper


def file_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def wrap(text: str, font: str, size: float, width: float) -> list[str]:
    lines: list[str] = []
    current = ""
    for word in text.split():
        candidate = f"{current} {word}".strip()
        if current and pdfmetrics.stringWidth(candidate, font, size) > width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def register_fonts(root: Path, work: Path) -> None:
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont

    fonts = root / "public/smarty-colours/fonts"
    for filename, name, weight in [
        ("grandstander-latin.woff2", "Grandstander800", 800),
        ("grandstander-latin.woff2", "Grandstander900", 900),
        ("andika-regular-latin.woff2", "Andika", None),
    ]:
        font = TTFont(fonts / filename, recalcTimestamp=False)
        font.flavor = None
        if weight is not None and "fvar" in font:
            font = instantiateVariableFont(font, {"wght": weight}, inplace=True)
        font.recalcTimestamp = False
        target = work / f"{name}.ttf"
        font.save(target)
        pdfmetrics.registerFont(ReportLabFont(name, str(target)))


def vector_art(root: Path, page: dict, work: Path):
    """Trace the approved original at native resolution, without upscaling."""
    import vtracer
    from svglib.svglib import svg2rlg

    source = root / "public" / page["image"].lstrip("/")
    key = file_hash(source)[:16]
    bitmap = work / f"{key}.png"
    svg = work / f"{key}.svg"
    if not svg.exists():
        with Image.open(source) as original:
            # The catalogue exports white-composited RGB originals. A second
            # explicit white composite also makes this safe for future RGBA input.
            rgba = original.convert("RGBA")
            white = Image.new("RGBA", rgba.size, "white")
            white.alpha_composite(rgba)
            binary = white.convert("L").point(lambda value: 0 if value < 150 else 255).convert("RGB")
            binary.save(bitmap)
        vtracer.convert_image_to_svg_py(
            str(bitmap), str(svg), colormode="binary", mode="spline",
            filter_speckle=2, corner_threshold=60, length_threshold=4.0,
            max_iterations=10, splice_threshold=45, path_precision=3,
        )
    drawing = svg2rlg(str(svg))
    if drawing is None:
        raise ValueError(f"Could not load vector trace for {page['id']}")
    return drawing


def reinforce(node, width: float) -> None:
    # Outlined filled vector regions retain the original picture while giving
    # even the finest printed details a 2.5pt round black edge. This does not
    # claim that the 1024px source has acquired extra raster detail.
    if getattr(node, "fillColor", None) == colors.black:
        node.strokeColor = colors.black
        node.strokeWidth = width
        node.strokeLineJoin = 1
        node.strokeLineCap = 1
    for child in getattr(node, "contents", []):
        reinforce(child, width)


def new_pdf(target: Path, size: tuple[float, float], title: str):
    target.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(target), pagesize=size, invariant=1, pageCompression=1)
    pdf.setTitle(title)
    pdf.setAuthor("SmartyColours - Scruffy Hipster Ltd.")
    pdf.setSubject("Free original colouring pages for home and classroom use")
    pdf.setCreator("SmartyColours deterministic printable generator")
    return pdf


def brand(pdf, root: Path, width: float, height: float, name_line: bool = True) -> None:
    top = height - MARGIN
    pdf.setFillColor(colors.black)
    pdf.setStrokeColor(colors.black)
    pdf.drawImage(str(root / "public/smarty-colours/pencil-app-icon.png"), MARGIN, top - 16 * mm,
                  width=16 * mm, height=16 * mm, mask="auto")
    pdf.setFont("Grandstander900", 25)
    pdf.drawString(MARGIN + 19 * mm, top - 11.2 * mm, "SmartyColours")
    if name_line:
        line_width = 43 * mm
        line_right = width - MARGIN
        label_x = line_right - line_width - 16 * mm
        pdf.setFont("Grandstander800", 15)
        pdf.drawString(label_x, top - 11.4 * mm, "Name")
        pdf.setLineWidth(0.8 * mm)
        pdf.setDash(1.8 * mm, 1.5 * mm)
        pdf.line(line_right - line_width, top - 12 * mm, line_right, top - 12 * mm)
        pdf.setDash()
    pdf.setLineWidth(FRAME)
    pdf.line(MARGIN + FRAME / 2, top - HEADER, width - MARGIN - FRAME / 2, top - HEADER)


def page_footer(pdf, width: float, title: str, pack_name: str) -> None:
    copy_width = width - 2 * MARGIN - 49 * mm
    title_lines = wrap(f"{title} · {pack_name} pack", "Grandstander800", 13.5, copy_width)
    if len(title_lines) > 2:
        raise ValueError(f"Page title is too long for the footer: {title}")
    y = MARGIN + FOOTER - 5 * mm
    pdf.setFillColor(colors.black)
    pdf.setFont("Grandstander800", 13.5)
    for line in title_lines:
        pdf.drawString(MARGIN, y, line)
        y -= 15.5
    y -= 2
    pdf.setFont("Andika", 9.5)
    for line in wrap(APP_SENTENCE, "Andika", 9.5, copy_width):
        pdf.drawString(MARGIN, y, line)
        y -= 12
    pdf.drawString(MARGIN, y - 1, DOMAIN)
    if y - 1 < MARGIN:
        raise ValueError(f"Footer exceeds the 10mm safe margin: {title}")
    pdf.setLineWidth(0.7 * mm)
    pdf.setStrokeColor(colors.black)
    start = width - MARGIN - 43 * mm
    for index in range(5):
        pdf.circle(start + (3.5 + index * 9) * mm, MARGIN + 18 * mm, 3.5 * mm, stroke=1, fill=0)


def sheet(pdf, root: Path, pack: dict, page: dict, drawing, size) -> dict:
    width, height = size
    brand(pdf, root, width, height)
    x, y = MARGIN + FRAME / 2, MARGIN + FOOTER + GAP + FRAME / 2
    box_width = width - 2 * MARGIN - FRAME
    top = height - MARGIN - HEADER - GAP - FRAME / 2
    box_height = top - y
    pdf.setLineWidth(FRAME)
    pdf.roundRect(x, y, box_width, box_height, 8 * mm, stroke=1, fill=0)
    art = copy.deepcopy(drawing)
    scale = min((box_width - 2 * ART_PADDING) / art.width, (box_height - 2 * ART_PADDING) / art.height)
    reinforce(art, MIN_ART_STROKE / scale)
    art.scale(scale, scale)
    art_x = x + (box_width - drawing.width * scale) / 2
    art_y = y + (box_height - drawing.height * scale) / 2
    renderPDF.draw(art, pdf, art_x, art_y)
    page_footer(pdf, width, page["title"], pack["name"])
    pdf.showPage()
    return {"artBoxMm": [round(value / mm, 3) for value in (x - FRAME / 2, y - FRAME / 2, box_width + FRAME, box_height + FRAME)],
            "vectorArtwork": True, "minimumVectorEdgePt": MIN_ART_STROKE}


def centred_lines(pdf, text: str, width: float, y: float, font: str, size: float, max_width: float, leading: float) -> float:
    pdf.setFont(font, size)
    for line in wrap(text, font, size, max_width):
        pdf.drawCentredString(width / 2, y, line)
        y -= leading
    return y


def cover_page(pdf, root: Path, pack: dict, size) -> None:
    width, height = size
    brand(pdf, root, width, height, name_line=False)
    y = height - MARGIN - HEADER - 17 * mm
    y = centred_lines(pdf, f"{pack['name']} colouring pack", width, y, "Grandstander800", 28, width - 30 * mm, 32)
    pdf.setFont("Andika", 13)
    pdf.drawCentredString(width / 2, y - 5 * mm, "Five free pages to print and colour")
    edge = min(145 * mm, height - 100 * mm)
    art_y = MARGIN + 35 * mm
    art_x = (width - edge) / 2
    pdf.setLineWidth(FRAME)
    pdf.roundRect(art_x, art_y, edge, edge, 8 * mm, stroke=1, fill=0)
    pdf.saveState()
    clip = pdf.beginPath()
    clip.roundRect(art_x + FRAME / 2, art_y + FRAME / 2, edge - FRAME, edge - FRAME, 7.4 * mm)
    pdf.clipPath(clip, stroke=0, fill=0)
    pdf.drawImage(str(root / "public" / pack["cover"].lstrip("/")), art_x, art_y,
                  width=edge, height=edge, preserveAspectRatio=True, anchor="c")
    pdf.restoreState()
    pdf.setFont("Andika", 11)
    pdf.drawCentredString(width / 2, MARGIN + 20 * mm, "For home and classroom use")
    pdf.setFont("Grandstander800", 15)
    pdf.drawCentredString(width / 2, MARGIN + 10 * mm, DOMAIN)
    pdf.showPage()


def end_page(pdf, root: Path, pack: dict, size) -> None:
    width, height = size
    brand(pdf, root, width, height, name_line=False)
    pdf.setFont("Andika", 11)
    pdf.drawCentredString(width / 2, height - 58 * mm, "For grown-ups")
    icon_size = 47 * mm
    icon_y = height - 116 * mm
    pdf.drawImage(str(root / "public/smarty-colours/pencil-app-icon.png"), (width - icon_size) / 2, icon_y,
                  width=icon_size, height=icon_size, mask="auto")
    y = icon_y - 21 * mm
    y = centred_lines(pdf, f"More {pack['name']} pages in the app", width, y,
                       "Grandstander800", 28, width - 35 * mm, 33)
    y -= 9 * mm
    y = centred_lines(pdf, "Colour the rest of the pack in SmartyColours on iPad and iPhone.", width, y,
                       "Andika", 14, width - 50 * mm, 20)
    pdf.setFont("Grandstander800", 17)
    pdf.drawCentredString(width / 2, max(MARGIN + 30 * mm, y - 22 * mm), DOMAIN)
    pdf.showPage()


def pdf_targets(root: Path, catalogue: dict):
    output = root / "public/smarty-colours/pdfs"
    for pack in catalogue["packs"]:
        for size_id, size in SIZES.items():
            for page in pack["pages"]:
                filename = f"smartycolours-{pack['id']}-{page['slug']}-{size_id}.pdf"
                yield output / filename, size, 1, pack, page
            filename = f"smartycolours-{pack['id']}-free-pages-{size_id}.pdf"
            yield output / filename, size, 7, pack, None


def check_vector_strokes(page, reader, filename: str) -> int:
    """Measure physical stroke widths from the saved PDF's graphics operations."""
    matrix = (1.0, 0.0, 0.0, 1.0, 0.0, 0.0)
    line_width = 1.0
    stack = []
    curves = 0
    artwork_paths = 0
    for operands, operator in ContentStream(page.get_contents(), reader).operations:
        if operator == b"q":
            stack.append((matrix, line_width))
        elif operator == b"Q":
            matrix, line_width = stack.pop()
        elif operator == b"cm":
            a, b, c, d, e, f = matrix
            A, B, C, D, E, F = (float(value) for value in operands)
            matrix = (a*A+c*B, b*A+d*B, a*C+c*D, b*C+d*D, a*E+c*F+e, b*E+d*F+f)
        elif operator == b"w":
            line_width = float(operands[0])
        elif operator == b"c":
            curves += 1
        elif operator in [b"S", b"s", b"B", b"B*", b"b", b"b*", b"f", b"f*", b"n"]:
            if curves >= 10:
                scale = min((matrix[0]**2+matrix[1]**2)**0.5, (matrix[2]**2+matrix[3]**2)**0.5)
                if operator in [b"f", b"f*", b"n"] or line_width * scale < MIN_ART_STROKE - 0.01:
                    raise ValueError(f"A traced artwork path is thinner than 2.5pt in {filename}")
                artwork_paths += 1
            curves = 0
    if artwork_paths == 0:
        raise ValueError(f"No original curved vector artwork found in {filename}")
    return artwork_paths


def validate(root: Path, catalogue: dict, evidence: Path) -> dict:
    """Inspect saved outputs independently of the drawing helper's return values."""
    results = []
    for path, expected_size, expected_count, pack, drawing in pdf_targets(root, catalogue):
        reader = PdfReader(str(path), strict=True)
        if len(reader.pages) != expected_count:
            raise ValueError(f"Wrong page count: {path.name}")
        if reader.get_fields() or reader.trailer["/Root"].get("/AcroForm"):
            raise ValueError(f"A child's name must remain a paper-only line: {path.name}")
        for index, page in enumerate(reader.pages):
            dimensions = (float(page.mediabox.width), float(page.mediabox.height))
            if any(abs(value - expected) > 0.02 for value, expected in zip(dimensions, expected_size)):
                raise ValueError(f"Wrong paper size on {path.name}, page {index + 1}")
            text = page.extract_text()
            if DOMAIN not in text or "SmartyColours" not in text:
                raise ValueError(f"Missing brand or domain on {path.name}, page {index + 1}")
            if re.search(r"https?://|apps\.apple\.com|\[site domain\]", text):
                raise ValueError(f"Unexpected external destination or placeholder in {path.name}")
            if page.get("/Annots"):
                raise ValueError(f"Unexpected PDF annotation, link or form widget in {path.name}")
            if drawing is not None or 1 <= index <= 5:
                if "Name" not in text or APP_SENTENCE not in " ".join(text.split()):
                    raise ValueError(f"Missing sheet header/footer text in {path.name}")
                xobjects = page.get("/Resources", {}).get("/XObject", {})
                images = [value.get_object() for value in xobjects.values()
                          if value.get_object().get("/Subtype") == "/Image"]
                # The original pencil icon is the only raster on a sheet. Large
                # artwork rasters would reveal an accidental low-DPI fallback.
                if any(int(image.get("/Width", 0)) > 512 or int(image.get("/Height", 0)) > 512 for image in images):
                    raise ValueError(f"Line art raster slipped into a vector sheet: {path.name}")
                operations = page.get_contents().get_data()
                if operations.count(b" c") < 10:
                    raise ValueError(f"Expected curved original vector paths in {path.name}")
                check_vector_strokes(page, reader, path.name)
        if expected_count == 7:
            if "For grown-ups" not in reader.pages[-1].extract_text():
                raise ValueError(f"Missing grown-up label on {path.name}")
        results.append({"file": path.name, "pages": expected_count, "bytes": path.stat().st_size, "sha256": file_hash(path)})
    expected_total = len(catalogue["packs"]) * 12
    if len(results) != expected_total:
        raise ValueError("The reviewed catalogue does not produce its expected PDF count")
    extras = set((root / "public/smarty-colours/pdfs").glob("*.pdf")) - {item[0] for item in pdf_targets(root, catalogue)}
    if extras:
        raise ValueError(f"Unexpected PDF files: {sorted(path.name for path in extras)}")
    summary = {"domain": DOMAIN, "packs": len(catalogue["packs"]), "sheets": sum(len(pack["pages"]) for pack in catalogue["packs"]),
               "pdfs": len(results), "totalPages": sum(row["pages"] for row in results),
               "totalBytes": sum(row["bytes"] for row in results), "lineArtwork": "vector paths traced from native-resolution originals with 2.5pt round black edges",
               "checks": ["exact page counts", "A4/US Letter media boxes", "brand/domain on every page", "no PDF links or child form fields", "vector line art rather than raster upscaling"], "files": results}
    evidence.parent.mkdir(parents=True, exist_ok=True)
    evidence.write_text(json.dumps(summary, indent=2) + "\n")
    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--work-dir", type=Path, default=Path("/tmp/smarty-colours-pdf-work"))
    parser.add_argument("--pack-offset", type=int, default=0)
    parser.add_argument("--pack-count", type=int, default=8)
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument("--validate-all", action="store_true")
    args = parser.parse_args()
    root = args.root.resolve()
    catalogue = json.loads((root / "content/smarty-colours/catalogue.json").read_text())
    if catalogue["domain"] != DOMAIN:
        raise ValueError("PDF domain must match the reviewed catalogue")
    evidence = root / "docs/smarty-colours-pdf-validation.json"
    if not args.validate_only:
        args.work_dir.mkdir(parents=True, exist_ok=True)
        register_fonts(root, args.work_dir)
        selection = catalogue["packs"][args.pack_offset:args.pack_offset + args.pack_count]
        if not selection or any(len(pack["pages"]) != 5 for pack in selection):
            raise ValueError("Select a bounded batch of reviewed five-page packs")
        if len(selection) > 8:
            raise ValueError("Use at most eight packs (96 PDFs) per authoring operation")
        for pack in selection:
            drawings = {page["id"]: vector_art(root, page, args.work_dir) for page in pack["pages"]}
            for size_id, size in SIZES.items():
                output = root / "public/smarty-colours/pdfs"
                for page in pack["pages"]:
                    pdf = new_pdf(output / f"smartycolours-{pack['id']}-{page['slug']}-{size_id}.pdf", size, page["title"])
                    sheet(pdf, root, pack, page, drawings[page["id"]], size)
                    pdf.save()
                bundle = new_pdf(output / f"smartycolours-{pack['id']}-free-pages-{size_id}.pdf", size, f"{pack['name']} - five free colouring pages")
                cover_page(bundle, root, pack, size)
                for page in pack["pages"]:
                    sheet(bundle, root, pack, page, drawings[page["id"]], size)
                end_page(bundle, root, pack, size)
                bundle.save()
            print(f"Created {pack['name']}: 12 PDFs", flush=True)
    if args.validate_only or args.validate_all:
        summary = validate(root, catalogue, evidence)
        print(json.dumps({key: value for key, value in summary.items() if key != "files"}, indent=2))


if __name__ == "__main__":
    main()

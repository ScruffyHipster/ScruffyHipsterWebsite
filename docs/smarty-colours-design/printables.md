# Printables and sharing

Every download and every saved picture carries the brand, so a page stuck on the fridge or pinned in a classroom says where it came from. Use the PrintSheet and ShareCard components as the master layouts.

## Printable pages (PDF)

- Make each page in two sizes: **A4** (210 × 297 mm) and **US Letter** (8.5 × 11 in). Default to A4 for UK visitors and Letter for US visitors, with the other one a tap away.
- 10 mm margins on all sides so home printers do not clip.
- **Header:** the SmartyColours lockup (app icon at 16 mm plus the wordmark) top left, and a "Name" line with a dashed rule top right for the child to write on. A 1.2 mm `line-art` rule under the header.
- **Art box:** the line art inside a 1.2 mm rounded box (8 mm radius). Line art must be pure black (`line-art`) on white, at least 300 dpi or vector, with lines no thinner than 2.5 pt so small hands can stay inside them.
- **Footer:** page name and pack name in Grandstander, then one line in grown-up voice: "Colour more pictures in the SmartyColours app on iPad and iPhone", followed by the site domain. The domain is not chosen yet: do not publish any printable, or the site, without it. Five empty circles on the right are a mini palette the child can colour in to plan their colours.
- No QR code that leads off-site without a grown-up gate. If a QR code is wanted, point it at a SmartyColours page that opens the ParentGate before the App Store.
- Use no colour on printables except the app icon. They should print well in black and white.
- File names: `smartycolours-<pack>-<page>-a4.pdf`, for example `smartycolours-farm-yard-curly-sheep-a4.pdf`. The five free pages of a pack: `smartycolours-<pack>-free-pages-a4.pdf`. It opens with a cover page showing the coloured pack cover and ends with a "More <pack> pages in the app" page: the app icon, one grown-up line and the site domain, with no direct App Store link or QR.

## Saved and shared pictures (PNG)

- After colouring online, Download saves a 1080 × 1080 PNG in the ShareCard frame: the sky gradient, the artwork in its grass frame, the lockup bottom left and "Coloured by a little artist" bottom right.
- Never put a child's name, age, school or location on a shared image.
- Share uses the device's own share sheet (Web Share API) behind the ParentGate. Where it is not available, fall back to Download.
- Print from the studio uses the PrintSheet layout with the child's colouring in the art box.

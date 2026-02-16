Poppins (local) — how to add font files

Place these `.woff2` files in this directory so the app can load Poppins locally:

- `poppins-regular.woff2`  (weight 400)
- `poppins-600.woff2`      (weight 600 / semibold)
- `poppins-700.woff2`      (weight 700 / bold)

Where to get them:
- Download Poppins from Google Fonts: https://fonts.google.com/specimen/Poppins
- Or use a helper like https://google-webfonts-helper.herokuapp.com/ to get `.woff2` files.

License:
Poppins is distributed under the SIL Open Font License (OFL) — you may host it locally.

Notes:
- If you add more weights, update `app/layout.tsx` `src` array accordingly.
- Filenames must match those referenced in `app/layout.tsx`.

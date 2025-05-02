export const EXCLUDED_FILES = ['desktop.ini', 'thumbs.db', '.ds_store'];

export const previewableMimeTypes: Record<string, string> = {
    // — Images —
    png:  'image/png',
    jpg:  'image/jpeg',
    jpeg: 'image/jpeg',
    bmp:  'image/bmp',
    gif:  'image/gif',
    webp: 'image/webp',

    // — Video —
    mp4:  'video/mp4',
    mov:  'video/quicktime',
    avi:  'video/x-msvideo',
    mkv:  'video/x-matroska',
  };

export const allowedUploadMimeTypes: Record<string, string> = {
    // — Images —
    png:  'image/png',
    jpg:  'image/jpeg',
    jpeg: 'image/jpeg',
    bmp:  'image/bmp',
    gif:  'image/gif',
    tiff: 'image/tiff',
    tif:  'image/tiff',
    webp: 'image/webp',
    avif: 'image/avif',
    heic: 'image/heic',
    heif: 'image/heif',
    ico:  'image/vnd.microsoft.icon',
    jfif: 'image/jpeg',
    svg:  'image/svg+xml',
  
    // — Video —
    mp4:  'video/mp4',
    mov:  'video/quicktime',
    avi:  'video/x-msvideo',
    mkv:  'video/x-matroska',
    webm: 'video/webm',
  
    // — Documents —
    pdf:  'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc:  'application/msword',
    odt:  'application/vnd.oasis.opendocument.text',
    rtf:  'application/rtf',
  
    // — Spreadsheets —
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls:  'application/vnd.ms-excel',
    csv:  'text/csv',
    ods:  'application/vnd.oasis.opendocument.spreadsheet',
  
    // — Presentations —
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ppt:  'application/vnd.ms-powerpoint',
    odp:  'application/vnd.oasis.opendocument.presentation',
  
    // — Archives —
    zip:  'application/zip',
    rar:  'application/vnd.rar',
    '7z':  'application/x-7z-compressed',
    tar:  'application/x-tar',
    gz:   'application/gzip',
  
    // — Text / Markdown —
    txt:  'text/plain',
    log:  'text/plain',
    md:   'text/markdown',
  
    // — Code —
    json: 'application/json',
    xml:  'application/xml',
    html: 'text/html',
    css:  'text/css',
    js:   'application/javascript',
    ts:   'application/typescript',
    cs:   'text/plain',
    java: 'text/x-java-source',
    py:   'text/x-python',
  
    // — Audio —
    mp3:  'audio/mpeg',
    wav:  'audio/wav',
    flac: 'audio/flac',
  };
 
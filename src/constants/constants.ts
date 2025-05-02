export const EXCLUDED_FILES = ['desktop.ini', 'thumbs.db', '.ds_store'];

export const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    mp4: 'video/mp4',
    mkv: 'video/x-matroska',
    webm: 'video/webm',
  };
  
  export const supportedMimeTypes: Record<string, string> = {
    // images & video
    png:  'image/png',
    jpg:  'image/jpg',
    jpeg: 'image/jpeg',
    gif:  'image/gif',
    avif: 'image/avif',
    heic: 'image/heic',
    heif: 'image/heif',
    ico:  'image/vnd.microsoft.icon',
    jfif: 'image/jpeg',
    svg:  'image/svg+xml',
  
    mp4:  'video/mp4',
    mkv:  'video/x-matroska',
    webm: 'video/webm',
  
    // documents
    pdf:  'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc:  'application/msword',
    odt:  'application/vnd.oasis.opendocument.text',
    rtf:  'application/rtf',
  
    // spreadsheets
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls:  'application/vnd.ms-excel',
    csv:  'text/csv',
    ods:  'application/vnd.oasis.opendocument.spreadsheet',
  
    // presentations
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ppt:  'application/vnd.ms-powerpoint',
    odp:  'application/vnd.oasis.opendocument.presentation',
  
    // archives
    zip:  'application/zip',
    rar:  'application/vnd.rar',
    '7z':  'application/x-7z-compressed',
    tar:  'application/x-tar',
    gz:   'application/gzip',
  
    // text & markdown
    txt:  'text/plain',
    log:  'text/plain',
    md:   'text/markdown',
  
    // code
    json: 'application/json',
    xml:  'application/xml',
    html: 'text/html',
    css:  'text/css',
    js:   'application/javascript',
    ts:   'application/typescript',
    cs:   'text/plain',
    java: 'text/x-java-source',
    py:   'text/x-python',
  
    // audio
    mp3:  'audio/mpeg',
    wav:  'audio/wav',
    flac: 'audio/flac',
  };
export const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
  
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = String(text).split(regex);
  
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{ backgroundColor: '#facc15', padding: '0 2px' }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };
  
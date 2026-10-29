export function FormattedRoast({ text }: { text: string | null }) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index}>{part.slice(2, -2)}</strong>
        ) : part.startsWith("*") && part.endsWith("*") ? (
          <strong key={index}>{part.slice(1, -1)}</strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

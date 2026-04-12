export default function SlotWords() {
  const wordList = ["accessible", "moderne", "professionnel"];
  return (
    <div className="slot-words">
      <span className="actual-span">{wordList[0]}</span>
      <span className="comma-span">,</span>
    </div>
  );
}

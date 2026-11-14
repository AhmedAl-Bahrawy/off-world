import SectionTitle from "./SectionTitle";

export default function StorySection({ id, number, title, subtitle, children }) {
  return (
    <section className="story-section" id={id}>
      <SectionTitle kicker={`CHAPTER ${number}`} title={title} note={subtitle} />
      {children}
    </section>
  );
}

import Panel from "./Panel";
import { fieldNotes } from "../data/home";

export default function FieldNotes() {
  return fieldNotes.map((note) => (
    <Panel key={note.id} title={`FIELD NOTE / ${note.id}`}>
      <p className="field-note">"{note.text}"</p>
      <span className="note-signature">{note.signature}</span>
    </Panel>
  ));
}

export class ItemComponent {
  constructor(private text: string) {}

  render(): JQuery<HTMLElement> {
    return $(`
      <li>
        ${this.text}
        <button class="remove-item">✕</button>
      </li>
    `);
  }

  static extractText($el: JQuery<HTMLElement>): string {
    return $el.text().replace("✕", "").trim();
  }
}
